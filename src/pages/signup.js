import { useEffect, useState } from 'react';
import '../css/common.css';
import '../css/signup.css';
import { url } from '../js/common';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function SignUp(props){

    // 패이지를 이동하기 위한 hook
    const navigate = useNavigate();

    // 이메일
    const [inuptEmail,setinuptEmail] = useState('');
    const [emailBloolean, setEmailBoolean] = useState(false);
    
    // 비밀번호
    const [inputPassword,setinputPassword] = useState('');
    const [passwordBloolean, setPasswordBoolean] = useState(false);

    // 비밀번호 확인 
    const [inputPasswordConfirm,setinputPasswordConfirm] = useState('');
    const [passwordConfirmBloolean, setPasswordConfirmBoolean] = useState(false);

    // 닉네임
    const [inputNickname,setinputNickname] = useState('');
    const [nicknameBloolean, setNicknameBoolean] = useState(false);

    // 이메일 형식 검사
    function isValidEmail(){
        const emailReg = 
            /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
        if(!inuptEmail){
            return false;
        } else if(!emailReg.test(inuptEmail)){
            setEmailBoolean(true);
            return false;
        }else{
            setEmailBoolean(false);
            return true;
        }
    }
    useEffect(()=>{
        isValidEmail();
    },[inuptEmail]);

    // 비밀번호 형식 검사
    function isValidPassword(){
        const passwordReg = 
            /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/;
        if(!inputPassword){
            return false;
        }else if(!passwordReg.test(inputPassword)){
            setPasswordBoolean(true);
            return false;
        }else{
            setPasswordBoolean(false);
            return true;
        }
    }
    useEffect(()=>{
        isValidPassword();
    },[inputPassword]);
    
    // 비밀번호 확인 검사
    function isValidPasswordConfirm(){
        
        if(!inputPasswordConfirm){
            return false;
        }else if(inputPassword !== inputPasswordConfirm){
            setPasswordConfirmBoolean(true);
            return false;
        }
        else{
            setPasswordConfirmBoolean(false);
            return true;
        }
    }
    useEffect(()=>{
        isValidPasswordConfirm();
    },[inputPasswordConfirm]);

    // 닉네임 형식 검사
    function isValidNickname(){
        if(!inputNickname){
            return false;
        }else if(inputNickname.length < 2 || inputNickname.length > 10){
            setNicknameBoolean(true);
            return false;
        }else{
            setNicknameBoolean(false);
            return true;
        }
    }
    useEffect(()=>{
        isValidNickname();
    },[inputNickname]);


    // ##########  회원가입 API 요청

    async function signup(event){
        const isVaildReq = 
            isValidEmail() &&
            isValidPassword() &&
            isValidPasswordConfirm() &&
            isValidNickname();

        if(!isVaildReq){
            alert("회원 정보를 확인해 주세요");
        }
        

        const config = {
            method: "post",
            url: url + "/user",
            data: {
                email: inuptEmail,
                password: inputPassword,
                nickname: inputNickname
            }
        }
        try {
            const res = await axios(config);
        
            if(res.data.code === 400){
                alert(res.data.message);
                return false;
            }
            if(res.data.code === 200){
                alert(res.data.message);
                navigate('/signin');
                return true;
            }
            
        } catch (err) {
            console.error(err);
        }
    }


    return (
        <div id='Signup_wrap'>
            <div className="inner">
                <div className="signup_container">
                    <h1>안녕하세요 <span className="blue"> 성공일정</span>입니다. </h1>
                    <div className="signup_form">
                        {/* 이메일 */}
                        <input type="text" placeholder="이메일" id="email" onChange={(e)=>{setinuptEmail(e.target.value)}} />
                        <div className="email_message message" style={{visibility : emailBloolean === true ?"visible": "hidden"}}>
                            이메일 형식으로 입력해 주세요
                        </div>
                     
                        {/* 페스워드 */}
                        <input type="password" placeholder="비밀번호" id="password" onChange={(e)=>{setinputPassword(e.target.value)}} />
                        <div className="password_message message" style={{visibility : passwordBloolean === true ?"visible": "hidden"}}>
                            영문, 숫자, 특수문자(!@$%^*)조함 8자 이상으로 입력
                        </div>
                        
                        {/* 페스워드 확인 */}
                        <input type="password" placeholder="비밀번호확인" id="password_confirm" onChange={(e)=>{setinputPasswordConfirm(e.target.value)}} />
                        <div className="password_confirm_message message" style={{visibility : passwordConfirmBloolean === true ?"visible": "hidden"}}>
                            비밀번호가 맞지 않습니다. 
                        </div>

                        {/* 닉네임 */}
                        <input type="text" placeholder="닉네임" id="nickname" onChange={(e)=>{setinputNickname(e.target.value)}} />
                        <div className="nickname_message message" style={{visibility : nicknameBloolean === true ?"visible": "hidden"}}>
                            한글 or 영어 2 ~ 10자로 설정해주세요.
                        </div>
                        
                        <input type="button" value="회원가입" placeholder="회원가입" id="signup" onClick={signup} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;