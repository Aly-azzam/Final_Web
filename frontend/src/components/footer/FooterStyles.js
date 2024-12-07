import styled from "styled-components";

export const Box = styled.div`
    padding: 2% 2.5%;
    background: black;
    bottom: 0;
    width: 95%;
    border-top: 1px solid #39FF14;
    box-shadow: 0 -5px 15px rgba(57, 255, 20, 0.2);

    @media (max-width: 1000px) {
        // padding: 70px 30px;
    }
`;

export const Title = styled.h1`
    color: #39FF14;
    text-align: center;
    margin-top: 10px;
    font-size: 2.5em;
    text-shadow: 
        0 0 7px #39FF14,
        0 0 10px #39FF14,
        0 0 21px #39FF14,
        0 0 42px #39FF14;
    animation: titlePulse 2s ease-in-out infinite;

    @keyframes titlePulse {
        0%, 100% {
            text-shadow: 
                0 0 7px #39FF14,
                0 0 10px #39FF14,
                0 0 21px #39FF14,
                0 0 42px #39FF14;
        }
        50% {
            text-shadow: 
                0 0 10px #39FF14,
                0 0 15px #39FF14,
                0 0 30px #39FF14,
                0 0 60px #39FF14;
        }
    }
`;

export const FooterContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 1000px;
    margin: 0 auto;
`;

export const Column = styled.div`
    display: flex;
    flex-direction: column;
    text-align: left;
    margin-left: 10px;
`;

export const Row = styled.div`
    display: grid;
    grid-template-columns: repeat(
        auto-fill,
        minmax(185px, 1fr)
    );
    grid-gap: 20px;

    @media (max-width: 1000px) {
        grid-template-columns: repeat(
            auto-fill,
            minmax(200px, 1fr)
        );
    }
`;

export const FooterLink = styled.a`
    color: #fff;
    margin-bottom: 10px;
    font-size: 16px;
    text-decoration: none;
    transition: all 0.3s ease;
    position: relative;

    &:hover {
        color: #39FF14;
        text-shadow: 0 0 5px #39FF14;
        transform: translateX(3px);
    }

    &::before {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 0;
        height: 1px;
        background: #39FF14;
        transition: width 0.3s ease;
        box-shadow: 0 0 5px #39FF14;
    }

    &:hover::before {
        width: 100%;
    }
`;

export const Heading = styled.p`
    font-size: 20px;
    color: #39FF14;
    margin-bottom: 20px;
    font-weight: bold;
    text-shadow: 0 0 10px rgba(57, 255, 20, 0.5);
    animation: headingPulse 2s ease-in-out infinite;

    @keyframes headingPulse {
        0%, 100% {
            text-shadow: 0 0 10px rgba(57, 255, 20, 0.5);
        }
        50% {
            text-shadow: 0 0 15px rgba(57, 255, 20, 0.8);
        }
    }
`;
