import { DynamicComponent } from "../../../../../base/dynamic_components/DynamicComponent";
import { LeadPassengerForm } from "./passenger_forms/LeadPassengerForm";
import { SupportPassengerForm } from "./passenger_forms/SupportPassengerForm";
import { PassengerTypes } from "./passenger_forms/PassengerTypes";

export class PassengerForm extends DynamicComponent {
    getAs(type: typeof PassengerTypes.LEAD): LeadPassengerForm
    getAs(type: typeof PassengerTypes.SUPPORT): SupportPassengerForm
    getAs(key: keyof typeof PassengerTypes): LeadPassengerForm | SupportPassengerForm {
        switch (key) {
            case PassengerTypes.LEAD:
                return new LeadPassengerForm(() => this.wrapper())
            case PassengerTypes.SUPPORT:
                return new SupportPassengerForm(() => this.wrapper())
            default:
                throw new Error(`Unknown passenger type: ${key}`)
        }
    }

}