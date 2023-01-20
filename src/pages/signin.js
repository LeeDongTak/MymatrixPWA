import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { url } from '../js/common';
import '../css/common.css';
import '../css/signin.css';
import axios from 'axios';


function SignIn(){

    // 패이지를 이동하기 위한 hook
    const navigate = useNavigate();
    
    // 이메일 비밀번호 값 저장
    const [inputEmail, setInputEmail] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    

    // #### 토큰검사
    const token = localStorage.getItem("x-access-token");
    if(token){
        alert("로그아웃 후 이용해 주세요.");
        navigate('/');
    }

    // #### 로그인 API 요청
    async function signin(event){
        if(!inputEmail || !inputPassword){
            alert("아이디/ 페스워드가 입력돠지 얺았습니다. ");
            return false;
        }
    
        // 로그인 API 요청
        const config = {
            method: "post",
            url: url + "/signin",
            data: {
              email: inputEmail,
              password: inputPassword  
            }
        }
        try {
            const res = await axios(config);
            
            if(res.data.code !== 200){
                alert(res.data.message);
                return false;
            }
            localStorage.setItem("x-access-token", res.data.result.token);
            navigate('/');
            return true;
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div id='Signin_wrap'>
            <div className="inner">
                <div className="signin_container">
                    <h1>안녕하세요 <span className="blue"> 성공일정</span>입니다. </h1>
                    <div className="signin_form">
                        <input type="text" placeholder="이메일" id="email" 
                            onKeyUp={ (e)=>{ 
                                if(e.key === 'Enter'){
                                    signin();
                                }
                            }  } onChange={(e)=>{setInputEmail(e.target.value)}} />
                        
                        <input type="password" placeholder="비밀번호" id="password" 
                            onKeyUp={ (e)=>{ 
                                if(e.key === 'Enter'){
                                    signin();
                                }
                            }  } onChange={(e)=>{setInputPassword(e.target.value)}} />
                        <input type="button" value="로그인" id="signin" onClick={signin} />
                        <div className="signup_btn" onClick={()=>{ navigate('/signup') }}><a href='#'>회원가입</a></div>
                    </div>
                    {/* signin_form */}
                </div>
                {/* signin_container */}
            </div>
            {/* inner */}
        </div>
    );    
}

export default SignIn;