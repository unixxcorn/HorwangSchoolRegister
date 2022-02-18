import Vue from 'vue'
import { Plugin } from '@nuxt/types'

const rulesPlugin: Plugin = (_, inject) => {
    const $rules = {
        required: (v: any) => !!v || v === 0 || 'กรุณากรอกข้อมูล',
        selected: (v: any) => v.length !== 0 || 'กรุณาเลือกข้อมูล',
        numeric: (v: any) => /^\d+$/.test(v) || 'กรอกเฉพาะตัวเลขเท่านั้น',
        equal: (check: any) => (v: any) => !v || v === check || 'ไม่ตรงกัน',
        length: (size: any) => (v: any) => !v || v.length === size || `ความยาวไม่เกิน ${size} หลัก`,
    }

    Vue.prototype.$rules = $rules
    inject('rules', $rules)
}

export default rulesPlugin
