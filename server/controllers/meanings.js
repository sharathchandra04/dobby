import db from '../db/db';
var uuid = require('uuid');

export const fetchAll = (_req, res) => {
    db.query(`select * from meanings`,
        [],
        (err, result) => {
            if(err){
                console.log(err)
                res.status(400).json({ "error": err.message })
                return;
            }
            if(result){
                res.status(200).json(result)
            }
            else{
                res.status(200).json([])
            }
        })
}

// post
export const update = (req, res) => {
    var reqBody = req.body
    const meaning_id = reqBody.meaning_id
    const alpha_score = reqBody.alpha_score
    db.query(`update meanings set alpha_score = ${alpha_score} where id = '${meaning_id}'`,
        [],
        function(err, result){
            if(err){
                console.log(err)
                res.status(400).json({ "error": err.message })
                return;
            }
            res.status(200).json(result)
        })
}

export const getWords = (req, res) => {
    const word = req.query.meaning
    db.query(`select * from meanings where synonym_count > 0 order by alpha_score LIMIT 5`,
        [],
        function(err, meanings_result){
            if(err){
                console.log(err)
                res.status(400).json({ "error": err.message })
                return;
            }
            if(meanings_result){
                let meaning_ids = ''
                meanings_result.forEach((meaning)=>{
                    meaning_ids = meaning_ids +  `'${meaning.id}' ,`
                })
                meaning_ids = meaning_ids.slice(0, meaning_ids.length - 1)
                console.log(meaning_ids)
                db.query(`select * from synonyms where meaning_id in (${meaning_ids})`,
                    [],
                    function(err, syn_result){
                        if(err){
                            console.log(err);
                            res.status(400).json({ "error": err.message })
                            return;     
                        }
                        const data = {
                            synonyms: syn_result,
                            meanings: meanings_result 
                        }
                        res.status(200).json(data)
                    })

            }
            else{
                res.status(200).json(null)
            }
        })
}

export const check = (req, res) => {
    const word = req.query.meaning
    db.query(`select count(*) from meanings where meaning = (?)`,
        [word],
        function(err, result){
            if(err){
                console.log(err)
                res.status(400).json({ "error": err.message })
                return;
            }
            console.log('check result --->  ',result)
            const data = {
                check: true
            }
            if(result[0]['count(*)'] == 0){
                data.check = false
            }
            res.status(200).json(data)
        })
}

export const getMeaning = (req, res) => {
    const meaning = req.query.meaning
    db.query(`select * from meanings where meaning = (?)`,
        [meaning],
        function(err, result){
            if(err){
                console.log(err)
                res.status(400).json({ "error": err.message })
                return;
            }
            if(!result.length){
                console.log(err)
                res.status(200).json({ "message": 'no such word available' })
            }
            db.query(`select * from definitions where meaning_id = (?)`,
                [result[0].id],
                function(err, definition_result){
                    if(err){
                        console.log(err)
                        res.status(400).json({ "error": err.message })
                        return;
                    }
                    db.query(`select * from synonyms where meaning_id = (?)`,
                        [result[0].id],
                        function(err, synonym_result){
                            if(err){
                                console.log(err)
                                res.status(400).json({ "error": err.message })
                                return; 
                            }
                            const data = {
                                synonym_data: synonym_result,
                                word: result,
                                definitions: definition_result
                            }
                            res.status(200).json(data)
                        })
                })

        })
}
// post
export const save = (req, res) => {
    var reqBody = req.body;
    const word_id = uuid.v4();
    db.query(`INSERT INTO meanings (id, meaning, alpha_score, beta_score, gamma_score, definition_count, synonym_count ) VALUES (?,?,?,?,?,?,?)`,
        [word_id, reqBody.word, 0, 0, 0, reqBody.definition_count, reqBody.synonym_count],
        function (err, result) {
            if (err) {
                console.log(err)
                res.status(400).json({ "error": err.message })
                return;
            }
            else{
                let values = ''
                let rowsData = []
                let synonyms = {}
                let def_ids = []
                reqBody.definitions.forEach((def) => {
                    values = values + '(?,?,?,?),'
                    let definition_id = uuid.v4()
                    rowsData.push(definition_id)
                    rowsData.push(word_id)
                    rowsData.push(def.definition)
                    rowsData.push(def.pos)
                    synonyms[definition_id] = def.synonyms
                    def_ids.push(definition_id)
                })
                values = values.slice(0 , values.length-1)
                db.query(`INSERT INTO definitions (id, meaning_id, definition, pos) VALUES ${values}`,
                    rowsData,
                    function (err, result) {
                        if (err) {
                            console.log(err)
                            res.status(400).json({ "error": err.message })
                            return;
                        }
                        let synonymRowsData = []
                        let synonym_values = ''
                        def_ids.forEach((def_id) => {
                            synonyms[def_id].forEach((syn) => {
                                synonymRowsData.push(uuid.v4())
                                synonymRowsData.push(word_id)
                                synonymRowsData.push(def_id)
                                synonymRowsData.push(syn)
                                synonym_values = synonym_values + '(?,?,?,?),'
                            })
                        })
                        synonym_values = synonym_values.slice(0, synonym_values.length-1)
                        console.log('synonymRowsData -> ', synonymRowsData)
                        if(synonymRowsData.length){
                            db.query(`INSERT INTO synonyms (id, meaning_id, definition_id, synonym) VALUES ${synonym_values}`,
                                synonymRowsData,
                                function (err, result){
                                    if(err) {
                                        console.log(err)
                                        res.status(400).json({ "error": err.message })
                                        return; 
                                    }
                                    res.status(201).json({
                                        "wordId": word_id
                                    })    
                                })
                        }
                        else{
                            res.status(201).json({
                                "wordId": word_id
                            })
                        }
                    });            
            }
        });
}