import { expect, describe, it } from "vitest";
import { mount } from "@vue/test-utils";

import TotalBloc from "../TotalBloc.vue"


describe('Test total bloc', () => {
    it('mount the component with props', function () {
        const wrapper = mount(TotalBloc, {
            props: {
                title: "Total expenses",
                amount: 1872,
                diff: -200
            }
        })
        expect(wrapper.text()).toContain("Total expenses");
        expect(wrapper.text()).toContain("1872 €");
        expect(wrapper.text()).toContain("-200 €");
    })
})