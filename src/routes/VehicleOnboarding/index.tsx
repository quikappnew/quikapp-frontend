import SidebarLayout from "layouts/SidebarLayout";
import VehicleOnboardingForm from "./vendorOnboardingForm"

const VehicleOnboarding = () => {
    return (
        <SidebarLayout>
            <VehicleOnboardingForm />
            {/* <VehicleOnboardingList /> */}
        </SidebarLayout>
    )
}

export default VehicleOnboarding;
