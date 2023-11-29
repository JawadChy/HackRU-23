import { Button } from "antd";
export default function LeButton({clickNext, clickBack}) {
    return (
        <div style={{display:"flex"}}>
            <Button onClick={clickBack} type="text" size="large" style={{flex:"1", margin:"10px",fontFamily: 'Exo'}}>Back</Button>
            <Button onClick={clickNext} type="primary" size="large" style={{flex:"1", margin:"10px",marginRight:"30px", background: "#ffa061", borderColor: "pink", fontFamily: 'Exo'}} > Next </Button>
        </div>
    )
  }