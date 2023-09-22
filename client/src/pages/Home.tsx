import styled from 'styled-components'
import { ReactComponent as SVG_logo } from "../img/logo.svg"
import { ChangeEvent, useState } from 'react'
// import loading from '../img/loading.png'

interface IParams {
  star: number,
  subDocument: boolean,
  textLength: number,
  includeText: string
}

function Home() {
  const [star, setStar] = useState(1);
  const [textLength, setTextLength] = useState(40000);
  const [subDocument, setSubDocument] = useState(false);
  const [includeText, setIncludeText] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  // const [count, setCount] = useState(1);

  const handleStarChange = (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement

    if (target.value === "" || isNaN(Number(target.value))) {
      setStar(0)
      target.style.width = '11.2px'
    } else {
      setStar(Number(target.value))
      target.style.width = `${11.2 * String(Number(target.value)).length}px`
    }
  }
  const handleTextLengthChange = (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement
    if (target.value === "" || isNaN(Number(target.value))) {
      setTextLength(0)
      target.style.width = '11.2px'
    } else {
      setTextLength(Number(target.value))
      target.style.width = `${11.2 * String(Number(target.value)).length}px`
    }
  }
  // const handleCountChange = (e: ChangeEvent) => {
  //   const target = e.target as HTMLInputElement
  //   if (isNaN(Number(target.value)) || Number(target.value[target.value.length - 1]) > 5) {
  //     setCount(0)
  //   } else if (target.value !== '') {
  //     setCount(Number(target.value[target.value.length - 1]))
  //   }
  // }
  function encodeQueryData(data: IParams) {
    const ret = [];
    for (let d in data) ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d as keyof IParams]));
    return ret.join('&');
  }
  const getRandomData = () => {
    setIsLoading(true);
    const data: IParams = {
      star,
      subDocument,
      textLength,
      includeText
    }
    fetch(`http://localhost:12999/one?${encodeQueryData(data)}`)
      .then(response => response.json())
      .then(data => {
        setIsLoading(false);
        if (data.error) {
          window.alert('"로봇이 아닙니다."를 통과해 주세요.')
          const newWindow = window.open('https://namu.wiki/random', '_blank');
          newWindow?.moveTo(0, 0);
          newWindow?.resizeTo(screen.width, screen.height);
        } else if (data.result) {
          // const newWindow = window.open(data.result, '_blank');
          // newWindow?.moveTo(0, 0);
          // newWindow?.resizeTo(screen.width, screen.height);
        } else {
          window.alert('조건에 맞는 나무위키를 찾지 못했습니다.');
        }
      })
      .catch(error => {
        console.log('오류 발생:', error);
      });
  }

  return (
    <Container>
      <SVG_logo style={{ marginTop: 36 }} />
      <Title id="title">랜무위키</Title>
      <SubTitle>두근두근 설레는 랜덤 나무위키 탐방!</SubTitle>
      {
        isLoading
          ? <Loading src={"loading.png"} alt="loading" />
          : <SearchBtn onClick={getRandomData}>SEARCH!</SearchBtn>
      }
      <Setting>
        <h1>조건</h1>
        <SettingDetails>
          <SettingComp>
            <h2>스타 :</h2>
            <input type="text" value={star} onChange={handleStarChange} />
            <h2>개 이상</h2>
          </SettingComp>
          <SettingComp>
            <h2>글자 :</h2>
            <input type="text" style={{ width: 11.2 * 5 }} value={textLength} onChange={handleTextLengthChange} />
            <h2>단어 이상</h2>
          </SettingComp>
          <SettingComp>
            <h2>하위문서 허용 :</h2>
            <input type="checkbox" id="cb1" checked={subDocument} onChange={e => setSubDocument(e.target.checked)} />
            <label htmlFor="cb1" />
          </SettingComp>
          <SettingComp>
            <h2>포함해야할 글자 : </h2>
            <IncludeTextInput
              type="text"
              placeholder='이곳에 작성'
              value={includeText}
              onChange={e => setIncludeText(e.target.value)}
              style={{ padding: "6px 8px", fontSize: 16 }}
            />
          </SettingComp>
          {/* <SettingComp>
            <h2>랜덤 갯수</h2>
            <input type="text" style={{ width: 11.5 }} value={count} onChange={handleCountChange} />
            <h2>개</h2>
          </SettingComp> */}
        </SettingDetails>
      </Setting>
      <Tips>
        <h1>어려운 조건일 경우 30초 이상의 시간이 소요될 수 있습니다.</h1>
        <h1>한번 검색할때 최대 150개의 랜덤한 나무위키 문서를 검색합니다.</h1>
      </Tips>
      <MadeBy>Made by <a onClick={() => {
        fetch(`http://localhost:12999/developer`)
        // const newWindow = window.open('https://github.com/KAWAN426', '_blank');
        // newWindow?.moveTo(0, 0);
        // newWindow?.resizeTo(screen.width, screen.height);
      }} href="#">KAWAN426</a></MadeBy>
    </Container>
  )
}

const Container = styled.div`
  width:100vw;
  min-height:100vh;
  padding-bottom: 40px;
  display:flex;
  flex-direction: column;
  align-items: center;
`
const Title = styled.strong`
  font-size: 32px;
  margin-top: 24px;
  margin-bottom: 14px;
`
const SubTitle = styled.sub`
  font-size: 20px;
  opacity: 0.6;
`
const SearchBtn = styled.button`
  background-color: #2A5AB7;
  outline: none;
  border: none;
  font-size: 20px;
  padding: 12px 24px;
  border-radius: 12px;
  margin: 50px;
  cursor: pointer;
`
const Setting = styled.section`
  padding: 20px 28px;
  width:300px;
  background-color: #2A2C31;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  h1{
    margin-bottom: 4px;
    font-size: 22px;
  }
`
const SettingDetails = styled.div`
  display: flex;
  flex-direction:column;
`
const SettingComp = styled.div`
  display: flex;
  align-items: center;
  margin-top: 18px;
  width:300px;
  h2{
    display:flex;
    font-size: 18px;
    margin-right: 8px;
    margin-left: 2px;
  }
  input{
    background-color:#17181b;
    padding: 0px 6px;
    font-size: 18px;
    border-radius: 4px;
    width:11.2px;
  }
  input[id="cb1"] + label {
    display: inline-block;
    width: 15px;
    height: 15px;
    border: 2px solid #ffffff;
    cursor: pointer;
    border-radius: 2px;
    margin: 10px;
  }
  input[id="cb1"]:checked + label {
    background-color: #ffffff;
  }
  input[id="cb1"] {
    display: none;
  }
`
const IncludeTextInput = styled.input`
  flex:1;
  background-color: "#393c43";
`
const Tips = styled.div`
  margin-top: 28px;
  display:flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  h1{
    opacity: 0.6;
    margin-bottom: 10px;
    font-size: 15px;
  }
`
const MadeBy = styled.h1`
  font-size: 16px;
  margin-top: 20px;
  padding: 4px;
  a{
    color: #1eee1e;
  }
  a:hover{
    text-decoration: underline;
  }
`
const Loading = styled.img`
  animation: rotate360 1s linear infinite;
  margin: 50px;
  width: 50px;
  height: 50px;
  @keyframes rotate360 {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`
export default Home
