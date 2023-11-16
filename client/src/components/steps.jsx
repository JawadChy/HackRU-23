import { Steps } from "antd";
import PropTypes from "prop-types";
import { useState } from "react";

export default function Lining({ stops, onStepClick }) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleStepClick = (index) => {
    setCurrentStep(index);
    const clickedTitle = stops[index].title;
    onStepClick(clickedTitle);
  };

  return (
    <Steps
      direction="vertical"
      current={currentStep}
      onChange={handleStepClick}
      items={stops}
    />
  );
}

Lining.propTypes = {
  stops: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
  onStepClick: PropTypes.func.isRequired,
};
