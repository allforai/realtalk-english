# 设计审计报告

## 摘要

- 执行模式: full
- 可用层: product-map, screen-map, use-case, feature-gap, feature-prune, ui-design
- 逆向追溯: 295 项检查, 295 PASS, 0 ORPHAN
- 覆盖洪泛: 208 项检查, 205 COVERED, 3 GAP, 覆盖率 99%
- 横向一致性: 36 项检查, 36 OK, 0 CONFLICT, 0 WARNING
- 信息保真: 追溯完整率 100% (PASS) · 视角覆盖率 94% (PASS)


## GAP（未覆盖）

| # | 检查项 | 任务 | 缺失层 | 说明 |
|---|--------|------|--------|------|
| 1 | C1 | 退出登录 | screen-map | 任务 T004 (退出登录) 在 screen-map 中无对应界面 |
| 2 | C1 | 刷新登录凭证 | screen-map | 任务 T003 (刷新登录凭证) 在 screen-map 中无对应界面 |
| 3 | C1 | 手动添加词汇到生词本 | screen-map | 任务 T023 (手动添加词汇到生词本) 在 screen-map 中无对应界面 |
