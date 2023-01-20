import styled from 'styled-components';

let ErrMessageBox = styled.div`
    height: 85vh;
    text-align: center;
    padding-top: 10vh 
`;
let ErrMessage1 = styled.h1`
    font-size: 5rem;
    padding-bottom: 25px
`;

function ErrorPage (){
    return (
        <ErrMessageBox>
            <ErrMessage1>404 page</ErrMessage1>
            <h2>없는 페이지 입니다. </h2>
        </ErrMessageBox>
    );
}

export default ErrorPage;