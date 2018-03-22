<template>
  <Layout description="vue server side render" keywords="egg, vue, webpack, server side render">
    <div class="container smart-container">
      <div class="row row-offcanvas row-offcanvas-right">
        <div class="col-xs-12 col-sm-9">
          <ul class="smart-artiles" id="articleList">
            <li v-for="item,index in list" :key="index">
              <div class="card">
                <h2>
                  <a :href="artRouter + item.article_id">{{item.article_title}}</a>
                </h2>
              </div>
            </li>
          </ul>
          <div id="pagerBottom" class="smart-pager" v-if="isLoading">
            <img src="../../../asset/images/loading.gif">
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
<style  lang="less">
@import "../assets/css/index.less";
.card {
  h2 {
    a {
      color: #1a1a1a;
    }
  }
}
</style>
<script type="text/babel">
export default {
  components: {},
  data() {
    return {
      isFinish: false,
      isLoading: false,
      pageIndex: 1,
      pageSize: 10,
      classify: 1,
      artRouter: "/home/detail/",
      list: []
    };
  },
  mounted() {
    import("service-worker-register").then(sw => {
      console.log(sw);
      sw.default.register("service-worker.js");
    });
    this.getClassify();

    window.addEventListener(
      "scroll",
      () => {
        this.loadPage();
      },
      false
    );
  },
  created() {
    this.fetch();
  },
  methods: {
    getClassify() {
      this.$http.get(`${location.origin}/classify`).then(res => {
        console.log("分类");
        console.log(res);
      });
    },
    fetch() {
      console.log("fetch....");
      console.log(location.origin);
      this.$http
        .get(
          `${location.origin}/home?pageIndex=${this.pageIndex}&pageSize=${
            this.pageSize
          }&classify=${this.classify}`
        )
        .then(res => {
          console.log("res", res);
          if (res.data.list && res.data.list.length) {
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
  }
};
</script>

