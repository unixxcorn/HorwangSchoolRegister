<template>
  <v-form
    ref="submitPackageForm"
    v-model="validSubmitPackage"
    lazy-validation
    class="my-8"
    @submit.prevent="submitPackage()"
    :style="{ width: '100%' }"
  >
    <v-card color="white" elevation="0" width="100%" class="pa-4">
      <v-card-title class="text-center font-weight-bold">
        <v-icon color="accent">mdi-book-open</v-icon>
        <span class="ml-2">ความประสงค์เลือกกลุ่มการเรียน</span>
      </v-card-title>
      <v-card-text class="body-1 accent--text">
        <p class="mb-8 deep-purple--text">
          หมายเหตุ : เลือกกลุ่มการเรียนเรียงตามอันดับที่<span class="font-weight-bold">ต้องการมากที่สุดไปยังต้องการน้อยที่สุด</span>
        </p>
        <v-row v-for="index of packageSize" :key="`${index}-package`">
          <v-col cols="5" md="2" class="text-right font-weight-bold mt-2 py-2">
            อันดับที่ {{ index }} :
          </v-col>
          <v-col cols="6" md="9" class="ml-2 py-2">
            <v-select
              :items="nowPackage"
              @change="setPackage({ val: $event, index })"
              @click:clear="removePackage({ index })"
              color="grey darken-3"
              background-color="white"
              :rules="[$rules.required]"
              :label="`เลือกกลุ่มการเรียนอันดับที่ ${index}`"
              :hint="`โปรดเลือกกลุ่มการเรียนอันดับที่ ${index}`"
              no-data-text="ไม่พบข้อมูล"
              dense
              outlined
              clearable
            />
          </v-col>
        </v-row>
        <p class="text-center mt-4 font-weight-bold">
          ** หลังจากดำเนินการ
          <span class="font-weight-bold font-italic error--text">"ลงทะเบียนเลือกกลุ่มการเรียน"</span>
          นักเรียนจะไม่สามารถแก้ไขได้อีก
          ควรตัดสินใจให้แน่นอนก่อนทำการเลือกกลุ่มการเรียน **
        </p>
      </v-card-text>
      <v-card-actions>
        <v-btn
          type="submit"
          color="primary"
          elevation="0"
          :disabled="!validSubmitPackage"
          width="100%"
          class="py-4"
        >
          <v-icon>mdi-submit</v-icon>
          <span class="subtitle-1">ลงทะเบียนเลือกกลุ่มการเรียน</span>
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- Confirm -->
    <layout-confirm
      v-model="isConfirm"
      title="ยืนยันสิ้นสุดการเลือก"
      :description="{
        text: 'หลังจากกด สิ้นสุดการเลือก นักเรียนจะไม่สามารถแก้ไขได้ดังนั้นตัดสินใจให้แน่นอนก่อนทำการเลือกกลุ่มการเรียน',
        color: 'accent',
      }"
      color="error"
      :loading="confirmIsLoading"
      @close="isConfirm = false"
      @submit="confirmEdit()"
    >
      <p
        v-if="errSubmitPackageMessage"
        class="caption error--text mt-2 my-0 py-0"
      >
        {{ errSubmitPackageMessage }}
      </p>
    </layout-confirm>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "vuex";

export default Vue.extend({
  name: "PackageForm",
  props: {
    profileData: {
      type: Object,
      required: true,
    },
    availablePackage: {
      type: Array,
      default: () => [],
    },
  },
  mounted() {
    this.selectedPackage = new Array(this.packageSize).fill(undefined) as any;
    this.nowPackage = [...this.availablePackage] as any;
  },
  data() {
    return {
      packageSize: this.availablePackage.length,
      selectedPackage: [],
      nowPackage: [],
      errSubmitPackageMessage: "",
      validSubmitPackage: false,
      isConfirm: false,
      confirmIsLoading: false,
    };
  },
  computed: {
    form(): Vue & { validate: () => boolean } {
      return this.$refs.submitPackageForm as Vue & { validate: () => boolean };
    },
  },
  methods: {
    ...mapActions("message", ["setMessage"]),

    setPackage({ val, index }: { val: any; index: number }) {
      const data = this.nowPackage.find((i: any) => i.value === val);
      (this.selectedPackage as any[])[index - 1] = data;
      (this.nowPackage as any[]) = this.nowPackage.map((i: any) => {
        if (i === data) {
          return { ...i, disabled: true };
        }
        return i;
      });
    },
    removePackage({ index }: { index: number }) {
      const data: any = this.selectedPackage[index - 1];
      (this.selectedPackage as any[])[index - 1] = undefined;
      (this.nowPackage as any[]) = this.nowPackage.map((i: any) => {
        if (i.value === data.value) {
          delete i["disabled"];
        }
        return i;
      });
    },
    submitPackage() {
      if (this.form.validate()) {
        this.isConfirm = true;
      }
    },
    confirmEdit() {
      this.confirmIsLoading = true;

      this.$axios
        .$post("/submit", {
          ...this.profileData,
          preferredPackages: this.selectedPackage.map((i: any) => i.value),
        })
        .then(() => {
          this.errSubmitPackageMessage = "";
          this.isConfirm = false;
          this.$emit("success");
          this.setMessage({
            title: "เลือกอันดับสำเร็จ",
            type: "ดำเนินการ",
            color: "success",
          });
        })
        .catch((error) => {
          this.errSubmitPackageMessage = error.response
            ? error.response.data.message
            : error.message;
          this.setMessage({
            title: "เลือกอันดับไม่สำเร็จ",
            type: "ดำเนินการ",
            color: "error",
          });
        })
        .finally(() => {
          this.confirmIsLoading = false;
        });
    },
  },
});
</script>