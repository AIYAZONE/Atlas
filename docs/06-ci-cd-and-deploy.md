# CI/CD 与部署策略

## CI/CD

* PR → Builder 单元测试
* Merge → SSG 构建
* Build → CDN 上传

## 增量构建

* 页面级 hash
* 产品变更仅重建关联页

## CDN

* HTML：强缓存 + 版本号
* API：边缘缓存
