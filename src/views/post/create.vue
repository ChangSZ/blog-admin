<template>
  <div>
    <Card>
      <div>
        <Form
          ref="formValidate"
          label-position="left"
          :model="formValidate"
          :rules="ruleValidate"
          :label-width="80"
        >
          <FormItem label="Title" prop="title">
            <Input v-model="formValidate.title" placeholder="title"></Input>
          </FormItem>
          <FormItem label="Category" prop="category">
            <Select
              v-model="formValidate.category"
              placeholder="Select your category"
            >
              <Option
                v-for="item in categories"
                :value="item.cates.ID"
                :key="item.cates.ID"
                ><span v-html="item.html"></span
                >{{ item.cates.DisplayName }}</Option
              >
            </Select>
          </FormItem>
          <FormItem label="Tags" prop="tags">
            <Alert type="warning">新增标签去标签页添加,请先保存好数据</Alert>
            <Select v-model="formValidate.tags" multiple filterable>
              <Option v-for="item in tags" :value="item.ID" :key="item.Name"
                >{{ item.DisplayName }}
              </Option>
            </Select>
          </FormItem>

          <FormItem label="Summary" prop="summary">
            <Input
              v-model="formValidate.summary"
              type="textarea"
              :autosize="{ minRows: 2 }"
              placeholder="Enter summary..."
            ></Input>
          </FormItem>
          <FormItem label="Content" prop="Content">
            <div id="vditor"></div>
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              @click="handleSubmit('formValidate')"
              :loading="loading"
              >Submit</Button
            >
            <Button
              @click="handleReset('formValidate')"
              style="margin-left: 8px"
              >Reset</Button
            >
          </FormItem>
        </Form>
      </div>
    </Card>
  </div>
</template>

<script>
import { PostCreate, PostStore } from "@/api/post";
import store from "@/store";
import Vditor from "vditor";
import "vditor/dist/index.css";

export default {
  data() {
    return {
      loading: false,
      formValidate: {
        title: "",
        category: "",
        tags: [],
        summary: "",
        content: "",
      },
      categories: {},
      tags: [],
      ruleValidate: {
        title: [
          {
            required: true,
            message: "The title cannot be empty",
            trigger: "blur",
          },
          {
            max: 100,
            message: "The title length is too long",
            trigger: "blur",
          },
        ],
        category: [
          // { required: true, message: 'Please select the category', trigger: 'change' },
          {
            type: "integer",
            message: "Please select the category",
            trigger: "change",
          },
        ],
        tags: [
          {
            type: "array",
            required: true,
            message: "Please select the tags",
            trigger: "blur",
          },
        ],
        summary: [
          {
            required: true,
            message: "The summary can not be empty",
            trigger: "blur",
          },
          {
            max: 250,
            message: "The summary length is too long",
            trigger: "blur",
          },
        ],
      },
      contentEditor: "",
    };
  },
  mounted() {
    this.contentEditor = new Vditor("vditor", {
      accept: "image/*",
      height: 360,
      toolbarConfig: {
        pin: true,
      },
      cache: {
        enable: false,
      },
      upload: {
        url: "/console/post/imgUpload",
        token: store.getters["auth/token"],
      },
      after: () => {
        // 在这里加载你的内容
        this.defaultData();
      },
      fullscreen: {
        index: 1000,
      },
    });
  },
  methods: {
    defaultData() {
      PostCreate()
        .then((data) => {
          this.tags = data.data.data.tags;
          this.categories = data.data.data.cates;
        })
        .catch(() => {
          console.log("err");
        });
    },

    handleSubmit(name) {
      this.loading = true;
      let that = this;
      this.$refs[name].validate((valid) => {
        if (valid) {
          PostStore(
            that.formValidate.title,
            that.formValidate.category,
            that.formValidate.tags,
            that.formValidate.summary,
            that.contentEditor.getValue()
          )
            .then((res) => {
              if (res.data.code === 0) {
                this.$Message.success(res.data.message);
                setTimeout(() => {
                  this.loading = false;
                  this.$router.push("/post/list");
                }, 2000);
              } else {
                this.$Message.error(res.data.message);
                this.loading = false;
              }
            })
            .catch((err) => {
              this.$Message.error("创建失败" + err);
            });
        } else {
          this.loading = false;
          this.$Message.error("Fail!");
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
  },
};
</script>
