import React, { Component } from 'react';
import { Col, Row, Button, FormControl } from 'react-bootstrap'
import axios from 'axios';
import { Link } from "react-router-dom";

interface IProps {
    history: any
}

interface IState {
    meaning: any,
    meaningId: any,
    meanings: any,
    meaningsList: any,
    synonyms: any,
    answerSynonyms: any,
    meaningIndex: any,
    current_scores: any,
    disableStart: any,
    displayResults: any,
    definitionData: any,
    definitionsList: any
}

class Header extends Component<IProps, IState> {
  constructor(props: IProps) {
      super(props)
      this.state = {
        meaning: '',
        meaningId: '',
        meanings: null,
        meaningsList: [],
        synonyms: [],
        answerSynonyms: [[]],
        meaningIndex: 0,
        current_scores: null,
        disableStart: true,
        displayResults: [],
        definitionData: null,
        definitionsList: []
      }
  }
  componentDidMount(){
  }
  shuffle(array: any) {
    var currentIndex = array.length,  randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  }
  loadTest(){
    axios.get('api/v1/meanings/get_words')
    .then((res)=>{
      console.log(res)
      const meanings: any = {}
      const meaningsList: any = []
      let synonyms: any = []
      const answerSynonyms: any = []
      const current_scores: any = {}
      res.data.meanings.forEach((meaning: any)=>{
        meanings[meaning.id] = {
          synonyms: [],
          meaning: meaning.meaning
        }
        meaningsList.push(meaning.id)
        answerSynonyms.push([])
        current_scores[meaning.id] = meaning.alpha_score
      })
      res.data.synonyms.forEach((synonym: any)=>{
        meanings[synonym.meaning_id]['synonyms'].push(synonym.synonym)
        synonyms.push(synonym);
      })
      // synonyms.forEach((s: any)=>{console.log(s.synonym)})
      synonyms = this.shuffle(synonyms)
      console.log('-----------------------')
      // synonyms.forEach((s: any)=>{console.log(s.synonym)})
      this.setState({
        meaningsList: meaningsList,
        meanings: meanings,
        synonyms: synonyms,
        answerSynonyms: answerSynonyms,
        current_scores: current_scores,
        disableStart: false
      })
    })
    .catch((err)=>{
      console.log(err)
    })
  }
  handleFetch(){
    const meaning = this.state.meaning.toLowerCase().trim()
    axios.get(`/get_meaning?meaning=${meaning}`)
    .then((res) => {
      const word = res.data.word.meaning
      const synonyms = res.data.synonym_data
      const definitions = res.data.definitions
      const definitionsList: any = []
      const definitionData: any = []
      definitions.forEach((def: any) => {
        definitionsList.push(def.id)
        definitionData[def.id] = def
      })
      synonyms.forEach((syn: any) => {
        if(!definitionData[syn.definition_id].synonyms){
          definitionData[syn.definition_id].synonyms = [{
            synonym: syn.synonym,
            synonym_id: syn.id
          }]
        }
        else{
          definitionData[syn.definition_id].synonyms.push({
            synonym: syn.synonym,
            synonym_id: syn.id
          })
        }
      })
      this.setState({
        meaning: word,
        meaningId: res.data.word.id,
        definitionData: definitionData,
        definitionsList: definitionsList
      })
    })
    .catch((err) => {
      console.log(err)
    })
  }
  async handleEnd(_e: any){
    const { meaningsList, meanings, answerSynonyms, current_scores} = {...this.state}
    const marks: any = {}
    meaningsList.forEach((meaning_id: any)=>{
      const number_of_synonyms = meanings[meaning_id].synonyms.length
      if(number_of_synonyms >= 10){
        marks[meaning_id] = 1
      }
      else{
        marks[meaning_id] = Math.round((10/number_of_synonyms)*100)/100
      }
    })
    const scores: any = {}
    meaningsList.forEach((meaning_id: any, index: any)=>{
      const answers = answerSynonyms[index]
      const keySynonyms = meanings[meaning_id].synonyms
      const print_answers = []
      answers.forEach((answer: any) => {
        print_answers.push(answer.synonym)
      })
      scores[meaning_id] = 0
      answers.forEach((answer: any) => {
        if( keySynonyms.includes(answer.synonym) ){
          if(scores[meaning_id]){
            scores[meaning_id] = scores[meaning_id] + marks[meaning_id]
          }
          else{
            scores[meaning_id] = marks[meaning_id]
          }
        }
      })
    })
    const displayResults: any = []
    meaningsList.forEach((meaning_id: any) => {
      if(scores[meaning_id] > 10){
        scores[meaning_id] = 10 + current_scores[meaning_id]
        displayResults.push({
          meaning: meanings[meaning_id].meaning,
          score: 10
        })
      }
      else{
        const sparescore = scores[meaning_id];
        scores[meaning_id] = scores[meaning_id] + current_scores[meaning_id]
        displayResults.push({
          meaning: meanings[meaning_id].meaning,
          score: sparescore
        })
      }
    })
    console.log(displayResults)
    meaningsList.forEach(async (meaningId: any)=>{
      const data = {
        meaning_id: meaningId,
        alpha_score: scores[meaningId]
      }
      await axios.post('api/v1/meanings/update', data)
    })
    this.setState({
      meanings: null,
      meaningsList: [],
      synonyms: [],
      answerSynonyms: [[]],
      meaningIndex: 0,
      current_scores: null,
      disableStart: true,
      displayResults: displayResults
    })
  }
  handleSelectSynonym(synonym: any, index: any){
    let synonyms = this.state.synonyms
    const answerSynonyms = this.state.answerSynonyms
    const meaningIndex = this.state.meaningIndex
    const deletedSynonym = synonyms.splice(index, 1);
    answerSynonyms[meaningIndex].push(deletedSynonym[0])
    this.setState({
      synonyms
    })
  }
  handleArrow(direction: any){
    let meaningIndex = this.state.meaningIndex
    let meaningsList = this.state.meaningsList
    if(meaningsList.length > 0){
      if(direction == 'left'){
        if(meaningIndex == 0){
          meaningIndex = meaningsList.length - 1
        }
        else{
          meaningIndex = meaningIndex - 1
        }
      }
      else{
        if( meaningIndex == (meaningsList.length - 1) ){
          meaningIndex = 0
        }
        else{
          meaningIndex = meaningIndex + 1
        }
      }
      this.setState({
        meaningIndex
      })
    }
  }
  render() {
    const { meaningsList, meanings, synonyms, answerSynonyms, meaningIndex, disableStart, displayResults } = {...this.state}
    return (
      <div className='p-3'>
        <Row className='justify-content-center'>
          <h3 className="text-warning">
            <u>Alpha Test</u>
          </h3>
        </Row>
        <Row className='justify-content-center'>
          <Col sm={3}>
            <Button
              className='mr-1 ml-5'
              size='sm'
              variant='outline-secondary'
              onClick={()=>{this.handleArrow('left')}}
            >
              ↤
            </Button>
            <Button
              className='m-1'
              variant='outline-primary'
              disabled={!disableStart}
              onClick={(e: any)=>{this.loadTest()}}
            >
              Start
            </Button>
            <Button
              className='m-1'
              variant='outline-primary'
              disabled={disableStart}
              onClick={(e: any)=>{this.handleEnd(e)}}
            >
              End
            </Button>
            <Button
              className='ml-1'
              size='sm'
              variant='outline-secondary'
              onClick={()=>{this.handleArrow('right')}}
            >
              ↦ 
            </Button>
          </Col>
        </Row>
        <Row className='justify-content-center p-2'>
          <Col sm={4}></Col>
          <Col 
            className='pt-2'
            sm={2} 
            style={{ 
              border: 'solid 1px grey', 
              borderRadius: '5px',
              textAlign: 'center',
              height: '40px',
              width:'200px'
            }}
          >
            <h6>{ meanings&&meanings[meaningsList[meaningIndex]].meaning }</h6>
          </Col>
          <Col sm={4}>
            <Row className='ml-1'>
            {
              displayResults.map((result: any) => {
                return <small
                  className='p-1'
                  style={{
                    color:'blue',
                    border: 'solid 1px grey',
                    borderRadius: '5px',
                    display: 'inline'
                  }}
                >
                  {result.meaning + ' - '+ result.score +'/10'}
                </small>
              })
            }
            {
              displayResults.length?
                <div
                  className='text-danger'
                  style={{
                    display: 'inline',
                    border: 'solid 1px red',
                    borderRadius: '5px',
                    color:'red',
                    backgroundColor:'lightpink',
                    cursor:'pointer'
                  }}
                  onClick={()=>{this.setState({displayResults:[]})}}
                >
                  DEL
                </div>:null
            }
            </Row>
          </Col>
        </Row>
        <Row
          style={{
            border: 'solid 1px grey',
            borderRadius: '5px',
            marginLeft: '100px',
            marginRight: '100px',
            // marginLeft: '250px',
            // marginRight: '250px',
            marginBottom: '5px'
          }}
        >
          <Col>
            <Row style={{backgroundColor:'#98FB98'}} className="justify-content-center">
              <h5 className="text-info"><u>answers</u></h5>
            </Row>
            <Row
              className="p-3"
              style={{
                borderTop: 'solid 1px grey',
                overflow: 'auto',
                minHeight: '100px', 
                maxHeight: '200px'
              }}
            >
              {
                answerSynonyms[meaningIndex].map((synonym: any, index: any)=>{
                  return <div
                    key={index}
                    style={{
                      display: 'inline',
                      backgroundColor: '#F0F8FF', 
                      border: '1px solid black', 
                      padding: '1px',
                      margin: '2px', 
                      borderRadius: '3px',
                      cursor: 'pointer',
                      height:'30px'
                    }}
                    onClick={(synonym)=>{
                      this.handleSelectSynonym(synonym, index)
                    }}
                  >
                    <small className="p-1">{synonym.synonym}</small>
                  </div>
                })
              }
            </Row>
          </Col>
        </Row>
        <Row
          style={{
            border: 'solid 1px grey', 
            borderRadius: '5px',
            marginLeft: '100px',
            marginRight: '100px'
          }}
        >
          <Col>
            <Row className='justify-content-center' style={{backgroundColor:'#FFE4E1'}}>
              <h5 className="text-info"><u>options</u></h5>
            </Row>
            <Row 
              className="p-2" 
              style={{  
                borderTop:'solid 1px grey',
                overflow: 'auto', 
                maxHeight: '200px'
              }}
            >
              {
                synonyms.map((synonym: any, index: any)=>{
                  return <div
                    key={index}
                    style={{
                      display: 'inline',
                      backgroundColor: '#F0F8FF', 
                      border: '1px solid black', 
                      padding: '1px',
                      margin: '2px', 
                      borderRadius: '3px',
                      cursor: 'pointer'
                    }}
                    onClick={(synonym)=>{
                      this.handleSelectSynonym(synonym, index)
                    }}
                  >
                    <small className="p-1">{synonym.synonym}</small>
                  </div>
                })
              }
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Header;
