import axios from 'axios';
import { url } from '../js/common';
import { useEffect, useState } from 'react';


// matrix
function Matrix(props){

    // 반복문을 위한 todo의 제목
    let todoTitle = [
        '🏃🏃 지금 해야할 일',
        '📅 계획을 세워서 해야할 일',
        '🏌 최후순위',
        '🏦 급하지만 중요도가 낮은일'
    ];

    let [todoContent,setTodoContent] = useState('');
    
    // 일정 조회
    async function readTodo(){
        // 토큰이 없으면 return
        const token = localStorage.getItem("x-access-token");
        if(!token){
            return;
        };
    
        // 일정 조회 API 호출하기
        const config = {
            method:"get",
            url: url +"/todos",
            headers: {"x-access-token":token}
        }
        try {
            const res = await axios(config);
            if(res.data.code !== 200){
                alert(res.data.message);
                return false;
            }
    
            // const todoDataSet = res.data.result;
            let copy = {...props.todoData};
            copy = res.data.result;
            props.setTodoData(copy);
        } catch (err) {
            console.error(err);
        }
    }
    useEffect(()=>{
        readTodo();
    },[props.todoData]);
    
    // 일정 생성
    async function createTodo(e){
        const contents = todoContent;
        const type = e.target.closest(".matrix_item").id;
        // 토큰 검사
        const token = localStorage.getItem("x-access-token");
        if(!token){
            return;
        }
        console.log(contents);
        console.log(type);
        if(!contents){
            alert("내용을 입력해 주세요");
            return false;
        }
    
        const config = {
            method: "post",
            url: url + "/todo",
            headers: {"x-access-token": token},
            data: {
                contents: contents, 
                type: type
            },
        }
    
        try {
            const res = await axios(config);
            if(res.data.code !== 200){
                alert(res.data.message);
                return false;
            }
    
            // DOM 업데이트
            e.target.value = "";
        } catch (err) {
            console.error(err);
            return false;
        }
    }
    
    // 체크박스
    async function updateTodoDone(e){
        const status = e.target.checked ? 'C' : 'A';
        const todoIdx = e.target.closest(".list_item").id;
        // 토큰 검사
        const token = localStorage.getItem("x-access-token");
        if(!token){
            return;
        }

        const config = {
            method: "patch",
            url: url + "/todo",
            headers: {"x-access-token": token},
            data: {
                todoIdx: todoIdx, 
                status: status
            },
        }
    
        try {
            const res = await axios(config);
            if(res.data.code !== 200){
                alert(res.data.message);
                return false;
            }
    
            // DOM 업데이트
            readTodo();
            e.target.value = "";
        } catch (err) {
            console.error(err);
            return false;
        }
    }
    
    // 컨텐츠 업데이트
    async function updateTodoContents(e){
        const contents = prompt("내용을 입력해 주세요.");
        const todoIdx = e.target.closest(".list_item").id;
        // 토큰 검사
        const token = localStorage.getItem("x-access-token");
        if(!token){
            return;
        }
    
        const config = {
            method: "patch",
            url: url + "/todo",
            headers: {"x-access-token": token},
            data: {
                todoIdx: todoIdx, 
                contents: contents
            },
        }
    
        try {
            const res = await axios(config);
            if(res.data.code !== 200){
                alert(res.data.message);
                return false;
            }
    
            // DOM 업데이트
            readTodo();
            e.target.value = "";
        } catch (err) {
            console.error(err);
            return false;
        }
    }
    
    // delete 이벤트 처리
    async function deleteTodo(e){
        if (window.confirm("삭제하시겠습니까? 삭제 후에는 복구가 어렵습니다. ")) {
            const todoIdx = e.target.closest(".list_item").id;
            // 토큰 검사
            const token = localStorage.getItem("x-access-token");
            if(!token){
                return;
            }
        
            const config = {
                method: "delete",
                url: url + "/todo/"+ todoIdx,
                headers: {"x-access-token": token},
            }
        
            try {
                const res = await axios(config);
                if(res.data.code !== 200){
                    alert(res.data.message);
                    return false;
                }
        
                // DOM 업데이트
                readTodo();
            } catch (err) {
                console.error(err);
                return false;
            }
            
            alert("삭제되었습니다. ");
          } else {
            alert("취소합니다.");
            return;
          }
        
    }
    return(
        <div id='main'>
            <div className="inner"> 
                <div className="jumbotron_container">
                    <div className="jumbotron_item_main">
                        <div className="jumbotron_item_main_message">
                            <p>내시간을 제대로 쓰고 싶다면,</p>
                            <h1>아이젠하워 메트릭스</h1>
                        </div>
                        <div className="jumbotron_item_main_image"></div>
                    </div>
                    {/* jumbotron_item_main */}
                    <div className="jumbotron_item_sub">
                        <p>긴급성과 중요도를 기준으로 시간관리를 하고,</p>
                        <p>일의 우선순위를 배문하는 방법입니다. </p>
                    </div>
                    {/* jumbotron_item_sub */}
                </div>
                {/* jumbotron_container */}
                <div className="matrix_container">
                {
                    Object.keys(props.todoData).map((i, k) => {
                        return(
                        <div className="matrix_item" id={i} key={i}>
                            <div className="matrix_item_header">
                                <div className="matrix_title">{ todoTitle[k] }</div>
                                <input type="text" className="matrix_input" placeholder="입력 후 Enter를 눌러주셔요." 
                                onChange={(e)=>{setTodoContent(e.target.value)}}
                                onKeyUp={ (e)=>{ 
                                    if(e.key === 'Enter'){
                                        createTodo(e);
                                    }
                                }  }  />
                            </div>
                            <ul className="matrix_item_list">
                                {Object.values(props.todoData[i]).map((i)=>{
                                    return(
                                    <li className="list_item" id={i.todoIdx} key={i.todoIdx}>
                                        <div className="done_text_container">
                                            <input type="checkbox" className='todo_tone'
                                                onClick={updateTodoDone}
                                                checked={
                                                    i.status === 'C'
                                                    ? "checked"
                                                    : ''
                                                }
                                                readOnly
                                            />
                                            <p className="todo_text">{i.contents}</p>
                                        </div>
                                        <div className="update_delete_container">
                                            <i className="todo_update fa-solid fa-pencil" onClick={updateTodoContents}></i>
                                            <i className="todo_delete fa-solid fa-trash-can" onClick={deleteTodo}></i>
                                        </div>
                                    </li>
                                    )
                                })}
                            </ul>
                            {/* matrix_item_list */}
                        </div>
                        )
                    })
                }       
                    <span className="importance">중요도</span>
                    <span className="urgency">긴급성</span>
                </div>
            </div>
        </div>
    );
}

export default Matrix;