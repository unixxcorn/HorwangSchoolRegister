<template>
  <v-card
    elevation="0"
    class="pa-4"
    :width="!$vuetify.breakpoint.mdAndDown ? '50%' : '100%'"
  >
    <!-- Title -->
    <v-card-title class="headline d-flex justify-center">
      <v-icon>mdi-lock</v-icon>
      <span class="ml-2">เข้าสู่ระบบ</span>
    </v-card-title>

    <!-- Form -->
    <v-form
      ref="loginForm"
      v-model="validLogin"
      lazy-validation
      class="pt-8"
      @submit.prevent="login()"
    >
      <v-text-field
        v-model="loginForm.studentId"
        type="number"
        color="grey darken-3"
        background-color="white"
        prepend-inner-icon="mdi-account"
        :rules="[$rules.required, $rules.numeric, $rules.length(5)]"
        label="เลขประจำตัวนักเรียน 5 หลัก"
        hint="โปรดกรอกเลขประจำตัวนักเรียน 5 หลัก"
        dense
        outlined
      />
      <v-text-field
        v-model="loginForm.identityNumber"
        type="number"
        color="grey darken-3"
        background-color="white"
        prepend-inner-icon="mdi-card-account-details"
        :rules="[$rules.required, $rules.numeric, $rules.length(13)]"
        label="เลขบัตรประชาชน"
        hint="โปรดกรอกเลขบัตรประชาชน"
        dense
        outlined
      />

      <p v-if="errLoginMessage" class="caption error--text mt-2 my-0 py-0">
        {{ errLoginMessage }}
      </p>
      <v-btn
        type="submit"
        color="primary"
        elevation="0"
        :loading="loginIsLoading"
        :disabled="!validLogin"
        width="100%"
        class="py-4"
      >
        <v-icon>mdi-login</v-icon>
        <span class="subtitle-1">เข้าสู่ระบบ</span>
      </v-btn>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "vuex";

export default Vue.extend({
  name: "LoginForm",
  data() {
    return {
      loginForm: {
        studentId: "",
        identityNumber: "",
      },
      errLoginMessage: "",
      loginIsLoading: false,
      validLogin: false,
    };
  },
  computed: {
    form(): Vue & { validate: () => boolean } {
      return this.$refs.loginForm as Vue & { validate: () => boolean };
    },
  },
  methods: {
    ...mapActions("message", ["setMessage"]),

    login() {
      if (this.form.validate()) {
        this.loginIsLoading = true;
        this.$axios
          .$post("/student", this.loginForm)
          .then((res) => {
            this.errLoginMessage = "";
            this.$emit("isAuth", res);
            if (res.avaliablePackage) {
              this.setMessage({
                title: "เข้าสู่ระบบสำเร็จ",
                type: "ดำเนินการ",
                color: "success",
              });
            }
          })
          .catch((error) => {
            this.errLoginMessage = error.response
              ? error.response.data.message
              : error.message;
            this.setMessage({
              title: "เข้าสู่ระบบไม่สำเร็จ",
              type: "ดำเนินการ",
              color: "error",
            });
          })
          .finally(() => {
            this.loginIsLoading = false;
          });
      }
    },
  },
});
</script>