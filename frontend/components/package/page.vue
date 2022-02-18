<template>
  <v-container class="d-flex flex-column justify-center align-center">
    <!-- Info Card -->
    <package-profile-info :data="profile" />

    <!-- Form -->
    <package-form
      :profileData="profileData"
      :availablePackage="availablePackage"
      @success="$emit('getPDF')"
    />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "PackagePage",
  props: {
    data: {
      type: Object,
      required: true,
    },
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
    this.profile.studentId.value = this.data.studentId;
    this.profile.identityNumber.value = this.data.identityNumber;
    this.profile.fullName.value = `${this.data.title} ${this.data.firstName} ${this.data.lastName}`;
    this.profile.class.value = `${this.data.class}/${this.data.room} เลขที่ ${this.data.roomId}`;
  },
  data() {
    return {
      profile: {
        studentId: { title: "เลขประจำตัวนักเรียน", value: "-" },
        identityNumber: { title: "เลขประจำตัวประชาชน", value: "-" },
        fullName: { title: "ชื่อ-สกุล", value: "-" },
        class: { title: "ห้อง", value: "-" },
      },
    };
  },
});
</script>