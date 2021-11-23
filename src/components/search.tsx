import React, { Component } from 'react';
import { Col, Row, Button, FormControl } from 'react-bootstrap'
import { Link } from "react-router-dom";
import axios from 'axios';
import Select from 'react-select';
import { connect } from "react-redux"
import {
  increaseCounter,
  decreaseCounter,
} from "../redux/Counter/counter.actions"

interface IProps {
    history: any,
    count: any,
    increaseCounter: any,
    decreaseCounter: any,
}
interface IState {
    meaning: any,
    meaningId: any,
    definitionData: any,
    definitionsList: any,
    searchHistory: any,
    selectedMeaning: any, 
    meaningsList: any
}
class Search extends Component<IProps, IState> {
  constructor(props: IProps) {
      super(props)
      this.state = {
        meaning: '',
        meaningId: '',
        definitionData: null,
        definitionsList: [],
        searchHistory: [],
        selectedMeaning: null, 
        meaningsList: []
      }
  }
  componentDidMount(){
    console.log(this.props)
    this.fetchAll()
  }
  fetchAll(){
    axios.get('api/v1/meanings/fetch_all')
    .then((result: any)=>{
      const meanings = result.data;
      const options: any = []
      meanings.forEach((meaning: any)=>{
        options.push({
          label: meaning.meaning,
          value: meaning.id
        })
      })
      this.setState({
        meaningsList: options,
        selectedMeaning: options.length? options[0]: null
      })
    })
    .catch((err: any)=>{
      console.log(err)
    })
  }
  handleClick(e: any){
    const newTo = { 
        pathname: "/about", 
        param1: "Par1",
        state: { 
            foo: 'bar',
            data: ['a', 'b', {a: 'sharath'}]
          } 
    };
    const a = <Link to={newTo}>data new to</Link>
    this.props.history.push(newTo)
  }
  returnLink(){
    const newTo = { 
        pathname: "/about", 
        param1: "Par1",
        state: { 
            foo: 'bar',
            data: ['a', 'b', {a: 'sharath'}]
          } 
    };
    return <Link to={newTo}>data new to</Link>
  }
  takeTest(){
    const newTo = { 
      pathname: "/about", 
      param1: "Par1",
      state: { 
          foo: 'bar',
          data: ['a', 'b', {a: 'sharath'}]
        } 
    };
    this.props.history.push(newTo)
  }
  handleFetch(){
    const meaning = this.state.meaning.toLowerCase().trim()
    axios.get(`api/v1/meanings/get_meaning?meaning=${meaning}`)
    .then((res: any) => {
      console.log('get_ meaning ---> ', res.data)
      const word = res.data.word[0].meaning
      const synonyms = res.data.synonym_data
      const definitions = res.data.definitions
      const definitionsList: any = []
      const definitionData: any = []
      definitions.forEach((def: any) => {
        definitionsList.push(def.id)
        definitionData[def.id] = def
        definitionData[def.id].synonyms = []
      })
      synonyms.forEach((syn: any) => {
          definitionData[syn.definition_id].synonyms.push({
            synonym: syn.synonym,
            synonym_id: syn.id
          })
      })
      console.log(definitionData)
      this.setState({
        meaning: word,
        meaningId: res.data.word.id,
        definitionData: definitionData,
        definitionsList: definitionsList
      })
    })
    .catch((err: any) => {
      console.log(err)
    })
  }
  handlePreSearch(){
    console.log(this.state.meaning)
    const meaning = this.state.meaning.toLowerCase().trim()
    const searchHistory =  this.state.searchHistory
    if(!searchHistory.includes(meaning)){
      searchHistory.push(meaning)
      this.setState({
        searchHistory
      })
    }
    axios.get(`api/v1/meanings/check?meaning=${meaning}`)
    .then((result: any) => {
      console.log('result --> ', result)
      if(result.data.check){
        this.handleFetch()
      }
      else{
        this.handleSearch()
      }
    })
    .catch((err: any) => {
      console.log(err)
    })
  }
  handleSearch(){
    const meaning = this.state.meaning
    axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en_US/${meaning.toLowerCase().trim()}`)
      .then((res: any) => {
        console.log(res.data)
        const data: any = {
          word: meaning
        }
        const definitions: any = []
        const meanings = res.data[0].meanings
        let definition_count = 0
        let synonym_count = 0 
        meanings.forEach((meaning: any)=>{
          meaning.definitions.forEach((definition: any) => {
            console.log(definition)
            definitions.push({
              definition: definition.definition? definition.definition: '',
              synonyms: definition.synonyms? definition.synonyms: [],
              pos: meaning.partOfSpeech? meaning.partOfSpeech: ''
            })
            definition_count = definition_count + 1
            synonym_count = synonym_count + (definition.synonyms? definition.synonyms.length: 0)
          })
        })
        data.definitions = definitions
        data.definition_count = definition_count
        data.synonym_count = synonym_count
        console.log(data)
        axios.post(`api/v1/meanings/save`, data, { headers: { 'Content-Type': 'application/json' } })
        .then((res: any)=>{
            console.log(res.data)
            this.setState({
              meaningId: res.data.wordId
            })
            this.handleFetch()
        })
        .catch((err: any) => {
          console.log(err)
        })
      })
  }
  handleSelect(option: any){
    this.setState({
      meaning: option.label,
      meaningId: option.value,
      selectedMeaning: option
    }, () => { this.handlePreSearch()})
  }
  render() {
    const {meaning, meaningId, searchHistory, definitionData, definitionsList, selectedMeaning, meaningsList} = {...this.state} 
    return (
      <div className='p-3'>
        <Row>
          <div className="App">
            <div>Count: {this.props.count}</div>
            <button onClick={() => this.props.increaseCounter({name:'i am sharath'})}>Increase Count</button>
            <button onClick={() => this.props.decreaseCounter({name:'i am sharath'})}>Decrease Count</button>
          </div>
        </Row>
        <Row className='pl-3'>
          {
            searchHistory.map((word: any, index: any) => {
              return <div
                key={index}
                style={{
                  display: 'inline',
                  backgroundColor: '#F0F8FF', 
                  border: '1px solid black', 
                  padding: '1px', 
                  borderRadius: '3px'
                }}
              >
                <small 
                  className="p-2 m-1"
                  // style={{ border: '2px solid white', padding: '1px'}}
                >
                  {word}
                </small>
              </div>
            })
          }
        </Row>
        <Row className="justify-content-center">
          <Col sm={3}>
            <FormControl
              value={meaning}
              onChange={(e)=>{this.setState({meaning: e.target.value})}}
            />
          </Col>
          <Col sm={1}>
            <Button
              onClick={()=>{this.handlePreSearch()}}
            >
              Search
            </Button>
          </Col>
        </Row>
        <Row className="justify-content-center mt-3">
          <Col sm={5}></Col>
          <Col 
            sm={1} 
            className="p-2" 
            style={{
              textAlign:'center', 
              border:'solid 1px gray', 
              borderRadius: '5px'
            }}
          >
            {meaning}
          </Col>
          <Col sm={2}>
            <a href={`https://www.google.com/search?q=${meaning}+meaning`} target="_blank">
              <small className='ml-1'>search google</small>
            </a>
          </Col>
          <Col sm={2}>
            <Select
              options={meaningsList}
              value={selectedMeaning}
              onChange={(option: any) => {this.handleSelect(option)}}
            />
          </Col>
          <Col sm={1}></Col>
        </Row>
        {
          definitionsList.map((defId: any) => {
            return <Row 
                className="justify-content-center"
                key={defId}
                // style={{border:'solid 1px gray'}}
              >
              <Col sm={6} className="m-2 p-1" style={{border:'solid 1px gray', backgroundColor: '#f5e9c6', borderRadius: '5px'}}>
                <Row className="m-2" style={{fontStyle: 'italic'}}>
                  {definitionData[defId].definition}
                </Row>
                <Row className="m-2">
                  {
                    definitionData[defId].synonyms.map((syn: any) => {
                      return <div
                        key={syn.synonym_id} 
                        className="m-1"
                        style={{
                          display: 'inline',
                          backgroundColor: '#F0F8FF', 
                          border: '1px solid black', 
                          padding: '1px', 
                          borderRadius: '3px'
                        }}
                        >
                          <small 
                            className="p-2"
                          >
                            {syn.synonym}
                          </small>
                        </div>
                    })
                  }
                </Row>
              </Col>
            </Row>
          })
        }
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    count: state.counter.count,
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    increaseCounter: (data: any) => dispatch(increaseCounter(data)),

    decreaseCounter: (data: any) => dispatch(decreaseCounter(data)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search)
// export default Search;