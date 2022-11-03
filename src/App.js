import { useEffect, useRef, useState } from "react";


function App() {
  const [equationArr, setEquationArr] = useState([]);
  const canvasElement = useRef();
  const [tempDragGraphic, setTempDragGraphic] = useState("");
  const [comparator, setComparator] = useState("");
  const [rhs, setRhs] = useState("");
  const [operands, setOperands] = useState()

  const [mouseCoords, setMouseCoords] = useState({
    x: 0,
    y: 0
  });

  const rectWidth = 140;

  const mouseOffset = {
    x: 50,
    y: 50
  }

  useEffect(() => {
    fetch('http://localhost:5000/operands').then(res => res.json()).then(data => setOperands(data))
  }, [])

  const operators = [
    { title: '+', value: '+' },
    { title: '-', value: '-' },
    { title: '*', value: '*' },
    { title: '/', value: '/' },
  ]
  const comparators = [
    { title: '<', value: '<' },
    { title: '>', value: '>' },
  ]

  function drag(e) {
    setTempDragGraphic(<div className={e.target.className} data-value={e.target.getAttribute("data-value")}>{e.target.innerHTML}</div>);
    setMouseCoords({
      x: e.clientX - mouseOffset.x,
      y: e.clientY - mouseOffset.y
    });
  }


  function removeElement(e) {
    let value = e.target.getAttribute('data-value');
    setEquationArr(equationArr.filter((elem, index) => { return index != value })
      .map((elem, index) => { elem.position = index * rectWidth + 15; return elem }));
  }

  function handleMouseMove(e) {
    setMouseCoords({
      x: e.clientX - mouseOffset.x,
      y: e.clientY - mouseOffset.y
    });
  }

  function handleMouseUp(e) {
    if (tempDragGraphic !== "") {
      let value = e.target.getAttribute('data-value');
      let type = e.target.className;
      let alphabet = e.target.innerHTML;
      let canvasElementTop = canvasElement.current.offsetTop;
      let canvasElementHeight = canvasElement.current.clientHeight;
      let isInCanvasElement = e.clientY + window.scrollY > canvasElementTop && e.clientY + window.scrollY < canvasElementTop + canvasElementHeight;
      setTempDragGraphic("");
      if (isInCanvasElement) {
        const boundRect = e.target.getBoundingClientRect();
        const position = boundRect.left + canvasElement.current.scrollLeft;
        setEquationArr([...equationArr, { value: value, type: type, alphabet: alphabet, position: position }]
          .sort((a, b) => { return a.position - b.position })
          .map((elem, index) => { elem.position = index * rectWidth + 15; return elem })
        );
      }
    }
  }
  function renderComponent(component) {
    return component;
  }

  function evaluate(arr, comparator, rhs) {
    let expression = "";
    arr.forEach((elem) => expression += elem.value + " ");
    expression = expression + comparator + " " + rhs;
    try {
      alert(eval(expression));
    } catch (err) {
      alert("This is not a valid equation");
    }
  }

  return (
    <div onMouseMove={(e) => handleMouseMove(e)} onMouseUp={(e) => handleMouseUp(e)}>
      <div className="tempDragGraphic" style={{ position: 'fixed', opacity: 0.6, zIndex: 3, left: mouseCoords.x, top: mouseCoords.y }}>
        {
          renderComponent(tempDragGraphic)
        }
      </div>
      <div className="operands">
        {
          operands?.map(o =>
            <div key={o.value} className="operand" draggable={true} onDragStart={(e) => drag(e)} data-value={o.value}>{o.title.toLocaleUpperCase()}</div>
          )
        }
      </div>
      <div className="operators">
        {
          operators.map(o =>
            <div key={o.value} className='operator' draggable={true} onDragStart={(e) => drag(e)} data-value={o.value}>{o.title}</div>
          )
        }
        <span className="space"></span>
        {
          comparators.map(o =>
            <div key={o.value} className='comparator' onClick={(e) => setComparator(e.target.getAttribute('data-value'))} data-value={o.value}>{o.title}</div>
          )
        }
        <span className="space"></span>
        <div className="rhs" onClick={() => {
          let rhs = prompt("What should be the rhs integer?", "");
          (rhs.trim() !== "") ? setRhs(rhs) : setRhs("")
        }}>RHS Integer</div>
      </div>
      <div className="canvas" ref={canvasElement}>
        {
          equationArr.map((elem, index) => <div key={index} className={elem.type}><span className="remove" onClick={(e) => removeElement(e)} data-value={index}>x</span>{elem.alphabet}</div>)
        }
        {
          comparator && <div className="comparator"><span className="remove" onClick={() => setComparator("")}>x</span>{comparator}</div>
        }
        {
          rhs && <div className="rhs"><span className="remove" onClick={() => setRhs("")}>x</span>{rhs}</div>
        }
      </div>
      <button className="submit" onClick={() => evaluate(equationArr, comparator, rhs)}>Evaluate</button>
      <ul style={{ listStyleType: "none" }}>
        <li>Abdul Momin</li>
        <li>abdulmomin956@gmail.com</li>
      </ul>
    </div>
  );
}

export default App;
