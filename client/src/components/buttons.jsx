import { Button } from "antd";
export default function LeButton({clickNext, clickBack}) {
    return (
        <div style={{display:"flex"}}>
            <Button onClick={clickBack} type="text" size="large" style={{flex:"1", margin:"10px"}}>Back</Button>
            <Button onClick={clickNext} type="primary" size="large" style={{flex:"1", margin:"10px",marginRight:"30px", background: "#ffa061", borderColor: "pink"}} > Next </Button>
        </div>
    )
  }