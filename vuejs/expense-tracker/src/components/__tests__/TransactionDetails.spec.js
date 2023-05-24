import { expect, describe, it, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";

import TransactionDetails from "../TransactionDetails.vue"
import { createPinia, setActivePinia } from "pinia";


describe('Test transaction details', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('mount the component with props', function () {
        const description = "Cinema (Fast and Furious)"
        const date = new Date("2023-05-22 11:00:00").toString()
        const category_name = "Hobbies"
        const amount = 20

        const wrapper = mount(TransactionDetails, {
            props: {
                transaction: {
                    id: 1,
                    category_id: 1,
                    description: description,
                    date: date,
                    category_name: category_name,
                    amount: amount
                }
            }
        })
        expect(wrapper.text()).toContain(description);
        expect(wrapper.text()).toContain(category_name);
        expect(wrapper.text()).toContain(amount);
        expect(wrapper.text()).toContain("5/22/2023, 11:00:00");    
    })
})