<template>
  <v-card color="transparent" elevation="0" class="mt-12">
    <table>
      <tr>
        <td class="text-right pr-3">หากพบปัญหาในการเข้าใช้งานติดต่อได้ที่</td>
        <td>
          <v-btn :href="urlLink" color="success" elevation="3" small>
            <v-icon dark left> mdi-message </v-icon>
            {{ urlText }}
          </v-btn>
        </td>
      </tr>
      <tr>
        <td class="text-right pr-3">ติดต่อผู้ดูแลระบบ</td>
        <td>
          <v-btn :href="tel" color="secondary" elevation="3" small>
            <v-icon dark left> mdi-phone </v-icon>
            {{ contact }}
          </v-btn>
        </td>
      </tr>
    </table>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "LoginContact",
  data() {
    return {
      urlLink: "https://line.me/R/ti/p/@342wujjn",
      urlText: "Line: Mail@Horwang.ac.th",
      contact: "(+66) 097-924-1570",
      tel: "tel:+66979241570",
    };
  },
});
</script>
