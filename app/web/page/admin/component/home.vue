<template>
  <div id="admin-home">
    <h4 style="text-indent:20px;">Welcome !!!</h4>
  </div>
</template>
<style>
</style>
<script type="text/babel">
export default {
  name:'adminHome',
  components: {},
  data() {
    return {
     
    };
  },
  mounted() {
    import("service-worker-register").then(sw => {
      console.log(sw);
      sw.default.register("service-worker.js");
    });   
  },
  created(){

  },
  methods: {
    getClassify() {
      this.$http
        .get(`${location.origin}/classify`)
        .then(res => {
          console.log("分类");
          console.log(res);
        });
    },
    fetch() {
      this.$http
        .get(
          `${location.origin}/?pageIndex=${this.pageIndex}&pageSize=${
            this.pageSize
          }&classify=${this.classify}`
        )
        .then(res => {
          console.log("res", res);
          if (res.data.list && res.data.list.length) {
            this.total = res.data.total;
            this.list = this.list.concat(res.data.list);
          } else {
            this.isFinish = true;
          }
          this.isLoading = false;
        });
    },
    loadPage() {
      if (!this.isFinish && !this.isLoading) {
        this.isLoading = true;
        this.pageIndex++;
        setTimeout(() => {
          this.fetch();
        }, 1500);
      }
    }
  },
};
</script>

