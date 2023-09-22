import styled from 'styled-components'
import Home from './pages/Home'

const Container = styled.div`
  width:100%;
  min-height:100%;
`

function App() {
  return (
    <Container>
      <Home />
    </Container>
  )
}

export default App
