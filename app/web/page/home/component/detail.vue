<template>
  <Layout description="vue server side render" keywords="egg, vue, webpack, server side render">
    <div class="container">
      <h1>{{ detail.article_title }}</h1>
      <div class="otherMsg">发布日期:{{ detail.create_time }}</div>
      <div class="desc">{{ detail.article_desc }}</div>
      <div class="content" v-html="detail.article_content"></div>
    </div>
  </Layout>
</template>
<style lang='less' scoped>
.container {
  width: 1200px;
  margin: 0 auto;
  h1 {
    text-align: center;
  }
  .desc {
    background: #efefef;
    padding: 20px;
    color: #333;
    margin: 20px 0;
  }
  .content {
    img {
      margin: 0 auto;
    }
  }
}
</style>
<script type="text/babel">
export default {
  components: {},
  data() {
    return {
      detail: {},
      id: ""
    };
  },
  computed: {},
  created() {
    this.id = this.$route.params.id;
    console.log("created...");
    console.log(this.id);
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      this.$http
        .get(`${location.origin}/front/detail?id=` + this.id)
        .then(res => {
          console.log("res", res);
          this.detail = res.data;
        });
    }
  }
};
</script>