import './css/common.css';
import './css/header.css';
import './css/jumbotron.css';
import './css/matrix.css';
import './css/footer.css';
import Matrix from './pages/matrix';
import SignIn from './pages/signin';
import SignUp from './pages/signup';
import ErrorPage from './pages/errorpage';
import { Routes,Route, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { url } from './js/common';
import { cudController, createTodo } from './pages/matrix';
import axios from 'axios';




function App() {
    // 패이지를 이동하기 위한 hook
    const navigate = useNavigate();
    // todo데이터
    const [todoData, setTodoData] = useState({decide:0, do:0, delete:0, delegate:0});
    
  return (
    <div className="App">
        <Header  navigate={navigate} todoData={todoData} setTodoData={setTodoData} />

        <Routes>
            <Route path="/" element={<Matrix todoData={todoData} setTodoData={setTodoData} />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<ErrorPage />} />
        </Routes>

        <Footer />
    </div>
  );
}


// Header
function Header(props){

    // 유저의 닉네임
    const [nickName, setNickName] = useState('');
    // 토큰 검사를 위한 true/false
    let [nickNameBoolean, setNickNameBoolean] = useState(false);
    
    async function SetHeader(){
        // 로컬 스토리지에 토큰 존재여부 검사
        const token = localStorage.getItem("x-access-token");
        // 토큰이 없다면
        if(!token){
            setNickNameBoolean(false); 
            return;
        } 
        const cnofig = {
            method:"get",
            url: url +"/jwt",
            headers: {
                "x-access-token": token,
            }
        }
        try {
            const res = await axios(cnofig);
            if(res.data.code !== 200){
                console.log("잘못된 토큰입니다. ");
                setNickNameBoolean(false);
                return;
            } else {
                // 토큰이 있다면
                setNickNameBoolean(true);
                setNickName(res.data.result.nickname);
            }
        } catch (err) {
            console.error(err);
        }
    }
    
    useEffect(() => {
        SetHeader();  
    });
    

    function logOut(){
        let copy = {...props.todoData};
        copy = {decide:0, do:0, delete:0, delegate:0};
        props.setTodoData(copy);
        setNickNameBoolean(false);
        localStorage.removeItem("x-access-token");
        props.navigate('/');
        window.location.replace('/');
    }

    return (
        <div id='header'>
            <div className="inner">
                <div className="header_container">
                    <div className="title" onClick={()=>{ props.navigate('/') }}>
                        <a href="#">성공일정</a>
                    </div>
                    {/* <!-- title --> */}
                    <div className="sign_container">
                            <div className="unsigned" style={{display : nickNameBoolean === true ?"none": "flex"}} >
                                <div className="sign_in" onClick={()=>{ props.navigate('/signin') }}><a href="#">로그인</a></div>
                                <div className="sign_up" onClick={()=>{ props.navigate('/signup') }}><a href="#">회원가입</a></div>
                            </div>
                            {/* unsigned  */}
                            <div className="signed" style={{display : nickNameBoolean === true ?"block": "none"}} >
                                <div className="dropdown">
                                    <div className="dropdown_button">
                                        안녕하세요 <span className="nickname">{nickName}</span>님
                                        <i className="fa-solid fa-caret-down"></i>
                                    </div>
                                    {/* dropdown_button */}
                                    <div className="dropdown_content">
                                        <button id="sign_out" onClick={logOut} >로그아웃</button>
                                    </div>
                                    {/* dropdownn_content */}
                                </div>
                                {/* dropdown */}
                            </div>
                            {/* signed */}
                    </div>
                    {/* sign_container */}
                </div>
                {/* header_container */}
            </div>
        </div>
    );
}



// footer
function Footer(){
  return (
    <div id='footer'>
        <div className="inner">
            <div className="footer_container">
                <div className="author">개발자 : 홍길동</div>
                <div className="author_email">demmey@demmey.com</div>
            </div>
        </div>
    </div>
  );
}




export default App;
