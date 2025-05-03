
import CallToActionHeading from "./CallToActionHeading";
import CallToActionDescription from "./CallToActionDescription";
import CallToActionButtons from "./CallToActionButtons";

const CallToAction = () => {
  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <CallToActionHeading />
        <CallToActionDescription />
        <CallToActionButtons />
      </div>
    </section>
  );
};

export default CallToAction;
