import { Steps , ConfigProvider} from "antd";
import PropTypes from "prop-types";
import { useState } from "react";
import LeButton from "./buttons";
export default function Lining({ stops, onStepClick }) {
    const [currentStep, setCurrentStep] = useState(0);

    const handleStepClick = (index) => {
      setCurrentStep(index);
      onStepClick(index);
    };
    const handleBtnClickNext = () => {
      setCurrentStep(currentStep+1);
      const clickedTitle = stops[currentStep].title;
      onStepClick(clickedTitle);
    };
    const handleBtnClickBack = () => {
      setCurrentStep(currentStep-1);
      const clickedTitle = stops[currentStep].title;
      onStepClick(clickedTitle);
    };

    return (
      <div>
      <LeButton clickNext={handleBtnClickNext} clickBack={handleBtnClickBack}/>
      <ConfigProvider 
        theme={{
          components:{
            Steps:{
              iconSize:40,
            },
          },
        }}
      >
      <Steps
          direction="vertical"
          current={currentStep}
          onChange={handleStepClick}
          size="default"
          className="custom-steps"
        >
          {stops.map((step, index) => (
            <Steps.Step
              key={index}
              title={step.title}
              description={"Stop "+(index + 1)}
              className="custom-step"
            />
          ))}
        </Steps>
      </ConfigProvider>
      </div>
  );
}

Lining.propTypes = {
  stops: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  onStepClick: PropTypes.func.isRequired,
};