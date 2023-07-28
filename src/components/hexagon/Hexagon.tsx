interface HexagonProps {
    width: number;
    height: number;
    fill: string;
    value: number;
}

const Hexagon = ({ width, height, fill, value }: HexagonProps) => {
    return <svg 
        fill={fill} 
        height={height} 
        width={width} 
        version="1.1"
        id="Capa_1" 
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink" 
	    viewBox="0 0 184.751 184.751" 
        xmlSpace="preserve">
            <path d="M0,92.375l46.188-80h92.378l46.185,80l-46.185,80H46.188L0,92.375z"/>
            <text x={"50%"} y={"50%"} fontSize={width / 2} textAnchor={"middle"} dominantBaseline={"middle"} fill="white">{ value }</text>
        </svg>
}

export default Hexagon;