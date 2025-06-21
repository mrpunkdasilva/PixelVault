import styled from 'styled-components';

export const Container = styled.div`
    background-color: #28272f;
    color: #fff;
    min-height: 100vh;
    margin: 0;
    padding: 0;
`;

export const Area = styled.div`
    margin: auto;
    max-width: 980px;
    padding: 30px 0;
`;

export const Header = styled.div`
    margin: 0;
    padding: 20px 0;
    text-align: center;
    margin-bottom: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const ScreenWarning = styled.div`
    text-align: center;

    .emoji {
        font-size: 50px;
        margin-bottom: 20px;
    }
`;

export const PhotoList = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
`;

export const UploadForm = styled.form`
    background-color: #3d3f43;
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 30px;

    input[type=submit] {
        background-color: #756df4;
        border: 0;
        border-radius: 10PX;
        margin: 0 20px;
        padding: 8px 16px;
        color: #fff;
        font-size: 15px;
        cursor: pointer;

        &:hover {
            opacity: 0.9;
        }
    }
`;

