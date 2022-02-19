<template>
  <div :style="{ width: '100%' }">
    <!-- Login -->
    <login-page :user.sync="userData" v-if="!isAuthenticated" />

    <!-- Form -->
    <package-page
      :data="userData.profile"
      :profileData="profileData"
      :availablePackage="availablePackage"
      @getPDF="
        () => {
          alreadyRegister = true;
          getResult();
        }
      "
      v-if="isAuthenticated && !alreadyRegister"
    />

    <!-- Already Register -->
    <pdf-page :data="pdfFile" v-if="isAuthenticated && alreadyRegister" />

    <!-- Reject Confirm -->
    <layout-confirm
      v-model="showRejectDialog"
      title="ขอแสดงความเสียใจ"
      :description="{
        text: 'นักเรียนไม่มีสิทธิ์สมัครเรียนต่อระดับมัธยมปลายรูปแบบนักเรียนเดิม',
        color: 'accent',
      }"
      color="error"
      @close="showRejectDialog = false"
      @submit="showRejectDialog = false"
      :noCancel="true"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "vuex";

export default Vue.extend({
  name: "IndexPage",
  data() {
    return {
      userData: {},
      profileData: {},
      availablePackage: [],
      alreadyRegister: false,
      pdfFile: "",
      showRejectDialog: false,
    };
  },
  watch: {
    userData(val) {
      this.profileData = {
        studentId: val.profile.studentId,
        identityNumber: val.profile.identityNumber,
      };
      if (val.alreadyRegister) {
        this.getResult();
        this.alreadyRegister = true;
        this.availablePackage = [true] as any;
      } else if (!val.avaliablePackage) {
        this.showRejectDialog = true;
      } else {
        this.availablePackage = val.avaliablePackage
          .map((i: any) =>
            i.packages.map((j: any) => ({
              text: `(${i.groupName}) ${j.packageName}`,
              value: j.packageId,
            }))
          )
          .flat();
      }
    },
  },
  computed: {
    isAuthenticated() {
      const data: any = this.userData ?? {};
      const availablePackage: any = this.availablePackage ?? [];
      return Object.keys(data).length !== 0 && availablePackage.length !== 0;
    },
  },
  methods: {
    ...mapActions("message", ["setMessage"]),

    getResult() {
      this.$loader(true, "กำลังโหลดไฟล์ข้อมูล");

      const userData: any = this.userData;
      this.$axios
        .$post("/pdf", this.profileData, {
          responseType: "arraybuffer",
        })
        .then((res) => {
          const file = new Blob([res], { type: "application/pdf" });
          const fileURL = URL.createObjectURL(file);
          this.pdfFile = fileURL;

          this.setMessage({
            title: "กำลังโหลดไฟล์ข้อมูลสำเร็จ",
            type: "ดำเนินการ",
            color: "success",
          });
        })
        .catch((error) => {
          this.setMessage({
            title: "กำลังโหลดไฟล์ข้อมูลไม่สำเร็จ",
            type: "ดำเนินการ",
            color: "error",
          });
        })
        .finally(() => {
          this.$loader(false);
        });
    },
  },
});
</script>

<style lang="scss">
.v-application .headline,
.v-application .title,
.v-application .subtitle-1,
.v-application .subtitle-2,
.v-application .body-1
{
  font-family: inherit !important;
}
</style>