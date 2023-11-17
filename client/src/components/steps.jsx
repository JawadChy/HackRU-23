import { Steps , ConfigProvider} from "antd";
import PropTypes from "prop-types";
import { useState } from "react";
import LeButton from "./buttons";
export default function Lining({ stops, onStepClick }) {
    const [currentStep, setCurrentStep] = useState(0);

    const handleStepClick = (index) => {
      setCurrentStep(index);
      const clickedTitle = stops[index].title;
      onStepClick(index);
    };
    const handleBtnClickNext = () => {
      setCurrentStep(currentStep+1);
      const clickedTitle = stops[currentStep].title;
      onStepClick(index);
    };
    const handleBtnClickBack = () => {
      setCurrentStep(currentStep-1);
      const clickedTitle = stops[currentStep].title;
      onStepClick(index);
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
          className="custom-steps" // Add a custom class for styling
        >
          {stops.map((step, index) => (
            <Steps.Step
              key={index}
              title={step.title}
              description={"Stop "+(index + 1)}
              className="custom-step" // Add a custom class for styling each step
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
      // Include other properties if needed
    })
  ).isRequired,
  onStepClick: PropTypes.func.isRequired,
};