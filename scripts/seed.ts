/**
 * Seed script: create demo journal entries for development/testing.
 * Run with: npx tsx scripts/seed.ts
 */
import fs from "fs/promises"
import path from "path"

const JOURNAL_DIR = path.join(process.cwd(), "content", "journal")

// Demo entries based on user's actual journal content (anonymized for public repo)
const DEMO_ENTRIES: { date: string; content: string }[] = [
  {
    date: "2026-06-15",
    content: `---
date: '2026-06-15'
week: '2026-W25'
month: '2026-06'
quarter: '2026-Q2'
state:
  mood: tired
  body: heavy-chest
  occupying_thought: therapy-aftermath
  worth_today: write-down-the-insight
priorities:
  - text: 把咨询内容写下来
    done: true
  - text: 准备文献综述
    done: false
  - text: 喝水
    done: true
tasks:
  - text: 整理咨询笔记
    done: true
  - text: 阅读文献
    done: false
  - text: 散步
    done: true
quick_capture:
  - 突然想到一个实习方向可以问问导师
  - 宿舍要买洗衣液了
energy: 3
reading: ''
meditation: false
workout: false
maintenance:
  open_page: true
  focus_time: false
  review_line: true
  outdoor: true
  stretch: false
  treat: false
  ai_plan: false
  ai_review: true
review:
  facts: 去做了心理咨询。咨询师指出"你的自我已经被你自己抹杀了"。
  discoveries: 当被问到"身体哪里不舒服"的时候，能定位到胸口闷、嗓子堵——原来身体的信号一直都在，只是以前不去听。
  next_action: 先不急着找"改变的方向"。明天只做一件事——当心里冒出"算了"的时候，停下来问自己一句：我身体的感受是什么？
  did_well: 去咨询了——没有翘掉，没有敷衍，而且在咨询中真的哭了、真的说了一些东西。
  thorn: 咨询师的诊断像一根刺——"自我被抹杀"。不舒服，但它是真的。
  pattern: 习惯性地用"算了"压掉愤怒、压掉委屈、压掉自己该争的东西——这不是性格温顺，是自我抹杀。
handoff:
  primary: ''
  secondary: ''
  maintenance: ''
---

## 2026 / Q2 / June / Week 25
# DAILY NOTE
##### ❮ 2026-06-14 | 2026-06-15 | 2026-06-16 ❯
---

### 今日状态
- 此刻状态：疲惫。刚做完咨询，哭过，身体很重。
- 现在最占据我心里的事：咨询师说"你的自我已经被你抹杀了"——这句话一直在脑子里转。
- 如果今天只认真过好一天，什么算值得？把咨询里的东西写下来，不让自己转身就忘掉。

### 今日重点
- [x] 最重要的 1 件事：把咨询内容写下来
- [ ] 第二重要的 1 件事：准备文献综述
- [x] 维护生活秩序的 1 件小事：喝水

### 今日任务
- [x] 任务 1：整理咨询笔记
- [ ] 任务 2：阅读文献
- [x] 任务 3：散步

### 快速收纳
- 突然想到一个实习方向可以问问导师
- 宿舍要买洗衣液了

### 📕自由书写

今天去做了心理咨询。又哭了。

不知道为什么，好像还是不能释怀——释怀之前的那些遭遇和经历。咨询师说了一句话：**我的自我已经被我自己抹杀了**。突然发现是这样的。那些本来应该理直气壮去争取的东西，自己的合法权益，我甚至慢慢都不敢去争取了。

她说我需要练习：练习重视自己的感受，练习爱自己。

可是我觉得好难。甚至没有任何方向。从哪里开始？怎么才算"爱自己"？

但她说的另一句话我也记住了：现在的疲惫状态，或许就是在提醒我——应该改变了。

写到这里的时身体哪个地方最不舒服——胸口，闷的，像有块石头压着。

### 晚间复盘
> 先写事实，再写发现，再写一个你明天自己能做的小动作。只写 1 到 3 行也算完成。

#### 最低复盘
- 今天发生了什么（客观事实）：去做了心理咨询。咨询师指出自我抹杀问题。
- 我注意到什么（发现 / 情绪 / 学习）：当被问到"身体哪里不舒服"的时候能定位到胸口闷、嗓子堵。
- 明天我自己能做的一个小动作：当心里冒出"算了"的时候，停下来问自己一句：我身体的感受是什么？

#### 如果还有余力
- 今天一个做得不错的地方：去咨询了，没有翘掉。
- 今天出现了什么"带刺的机会"或小提醒：咨询师的诊断像一根刺。不舒服，但它是真的。
- 这件事更深地指向了什么模式：习惯性地用"算了"压掉愤怒和委屈——自我抹杀。

### 明日交接
- 明天最重要的 1 件事：
- 明天第二重要的 1 件事（可留空）：
- 明天维护秩序的 1 件小事（可留空）：

---
### ⚛️今日维护
#### 最低版本
- [x] 打开今天这页并写 3 行
- [ ] 完成 1 段不聊天的专注时间
- [x] 留下 1 句晚间复盘（事实 / 发现 / 下一步三选一也算）

#### 可选加分
- [x] 出门 / 走一走 / 晒太阳
- [ ] 拉伸或活动一下身体
- [ ] 吃一点让自己开心的东西

#### AI 协作
- [ ] 今天主动用一次 Miroir 拆计划
- [x] 今天主动用一次 Miroir 做复盘或整理

#### 记录项
- ⚡[energy::3]
- 📖[reading::]
- 🧘🏻[meditation::]
- 🏋🏻‍♂️[workout::]

#### 不求全做
- 今天能完成 最低版本 就算没有掉线
---`,
  },
  {
    date: "2026-06-14",
    content: `---
date: '2026-06-14'
week: '2026-W24'
month: '2026-06'
quarter: '2026-Q2'
state:
  mood: okay
  body: ''
  occupying_thought: week-review
  worth_today: finish-weekly-review
priorities:
  - text: 完成 SQL 练习题
    done: true
  - text: 写周记
    done: true
  - text: 散步
    done: false
tasks:
  - text: SQL 练习
    done: true
  - text: 周复盘
    done: true
  - text: 散步
    done: false
quick_capture: []
energy: 5
reading: SQL进阶练习
meditation: false
workout: false
maintenance:
  open_page: true
  focus_time: true
  review_line: true
  outdoor: false
  stretch: false
  treat: true
  ai_plan: false
  ai_review: false
review:
  facts: 周六。写了一周的周记。SQL 练习完成。这周整体状态比上周好一些——至少没有因为焦虑完全瘫痪的日子。
  discoveries: 周日做周记而不是赶任务，感觉这一天像"自己的"而不是"被安排好的"。这可能是一种可持续的节奏——每周有一天不需要 push，只是整理和回顾。
  next_action: 新的一周继续 SQL + 文献综述两条线。不要同时开第三条。
  did_well: 周记写了一版比较完整的——不是流水账，真的有找联结。
  thorn: ''
  pattern: ''
handoff:
  primary: 准备明天心理咨询
  secondary: 继续文献综述
  maintenance: 早点睡
---

## 2026 / Q2 / June / Week 24
# DAILY NOTE
##### ❮ 2026-06-13 | 2026-06-14 | 2026-06-15 ❯
---

### 今日状态
- 此刻状态：平静，有点累但精神还好。
- 现在最占据我心里的事：写完周记，整理这一周。
- 如果今天只认真过好一天，什么算值得？完成 SQL 并落实这周的周复盘。

### 今日重点
- [x] 最重要的 1 件事：完成 SQL 练习题
- [x] 第二重要的 1 件事：写周记
- [ ] 维护生活秩序的 1 件小事：散步

### 今日任务
- [x] 任务 1：SQL 练习
- [x] 任务 2：周复盘
- [ ] 任务 3：散步

### 快速收纳

### 📕自由书写

周六。放慢节奏。

上午把 SQL 的几个练习题写了——多表查询和子查询的部分。比想象中顺手。以前觉得"学编程好难"，现在发现真正的障碍不是难度，是"觉得自己不行"的预设。

下午写周记。翻看这周七天的日记，发现一个模式：每次提到"考编"，都是因为某个外部事件触发了焦虑——不是真的想去，是"不知道该往哪走"的时候逃到那个念头里。这周和上周比有进步：至少有两天的日记里写了"SQL 比想象中容易"——那个恐惧在变小。

写完周记感觉轻松了一些。像把一周的能量结了个账——花了多少、剩了多少、坏账在哪。

### 晚间复盘
> 先写事实，再写发现，再写一个你明天自己能做的小动作。

#### 最低复盘
- 今天发生了什么（客观事实）：周六。SQL 练习完成。写了一周的周复盘。没有因为焦虑瘫痪。
- 我注意到什么（发现 / 情绪 / 学习）：周日做周记而不是赶任务，是一种可持续的节奏——每周有一天不需要 push，只是整理和回顾。
- 明天我自己能做的一个小动作：新的一周继续两条线，不要同时开第三条。

#### 如果还有余力
- 今天一个做得不错的地方：周记写了一版比较完整的。
- 今天出现了什么"带刺的机会"或小提醒：

### 明日交接
- 明天最重要的 1 件事：准备心理咨询
- 明天第二重要的 1 件事（可留空）：继续文献综述
- 明天维护秩序的 1 件小事（可留空）：早点睡

---
### ⚛️今日维护
#### 最低版本
- [x] 打开今天这页并写 3 行
- [x] 完成 1 段不聊天的专注时间
- [x] 留下 1 句晚间复盘

#### 可选加分
- [ ] 出门 / 走一走 / 晒太阳
- [ ] 拉伸或活动一下身体
- [x] 吃一点让自己开心的东西

#### AI 协作
- [ ] 今天主动用一次 Miroir 拆计划
- [ ] 今天主动用一次 Miroir 做复盘或整理

#### 记录项
- ⚡[energy::5]
- 📖[reading::SQL进阶练习]
- 🧘🏻[meditation::]
- 🏋🏻‍♂️[workout::]

#### 不求全做
- 今天能完成 最低版本 就算没有掉线
---`,
  },
  {
    date: "2026-06-13",
    content: `---
date: '2026-06-13'
week: '2026-W24'
month: '2026-06'
quarter: '2026-Q2'
state:
  mood: productive
  body: ''
  occupying_thought: digital-gov-lit-review
  worth_today: finish-lit-review-direction
priorities:
  - text: 数字政府文献综述推进
    done: true
  - text: 开始背诵考试内容
    done: false
  - text: 喝水
    done: true
tasks:
  - text: 数字政府文献综述推进
    done: true
  - text: 整理背诵材料
    done: false
  - text: ''
    done: false
quick_capture:
  - 舍友已收集考试背诵材料
energy: 4
reading: SQL学习完成
meditation: false
workout: false
maintenance:
  open_page: true
  focus_time: true
  review_line: true
  outdoor: false
  stretch: false
  treat: true
  ai_plan: false
  ai_review: false
review:
  facts: 数字政府文献综述大差不差写完了。SQL学完了。跟导师讨论了暑期实习方向，聊完之后开始焦虑——是不是最终还是要回体制内？考试复习迟迟没有开始。
  discoveries: 你跟导师聊实习方向，想到的却是"要不要回体制内"——不是在回应导师，是被"未来不确定"触发了焦虑，然后跳到最远处的避难所。SQL"比想象中容易"也是一个发现——恐惧比事情大。
  next_action: 考试复习必须开始了——舍友材料已备好，哪怕只背半小时。
  did_well: SQL学完了，转向AI方向后补的第一个硬技能。文献综述主体收掉了。
  thorn: 失眠不是偶然的——导师聊实习→想体制内→焦虑→失眠。关键是"想体制内"这个节点——不是真的想去，是不想面对"自己杀出一条路"的恐惧。
  pattern: 每次面对"我不知道未来会怎样"，都摸同一个逃生门——考编。但门背后什么都没有。需要开始练习：在不确定中待着，不立刻找逃生门。
handoff:
  primary: 考试复习开始
  secondary: 文献综述整合
  maintenance: 考编的念头来了就让它来，不要跟它走
---

## 2026 / Q2 / June / Week 24
# DAILY NOTE
##### ❮ 2026-06-12 | 2026-06-13 | 2026-06-14 ❯
---

### 今日状态
- 此刻状态：按计划推进，没有慌乱。
- 现在最占据我心里的事：数字政府文献综述有了方向。
- 如果今天只认真过好一天，什么算值得？文献综述有明确方向，SQL 学完。

### 今日重点
- [x] 最重要的 1 件事：数字政府文献综述推进
- [ ] 第二重要的 1 件事：开始背诵考试内容
- [x] 维护生活秩序的 1 件小事：喝水

### 今日任务
- [x] 任务 1：数字政府文献综述推进
- [ ] 任务 2：整理背诵材料
- [ ] 任务 3：

### 快速收纳
- 舍友已收集考试背诵材料

### 📕自由书写

数字政府这一块大差不差写完了。虽然很多是AI生成的，但其实也有很多我自己的思考在里面——框架是我的，判断也是我的。

但考试复习迟迟没有开始。

晚上跟导师讨论了一下暑期实习的方向。聊完之后反而更焦虑了——又开始想，最终是不是还是要回体制内？深圳教师编？事业编？这个问题像回旋镖，每次面对不确定就会飞回来。为此辗转反侧，几乎没怎么睡着。

但今天做了一件值得记的事：把SQL学完了。这个语言比想象中容易很多。之前觉得"学编程好难"，真正开始才发现没有想得那么可怕。又是一个"恐惧比事情大"的例子。

### 晚间复盘

#### 最低复盘
- 今天发生了什么（客观事实）：文献综述写完。SQL学完。导师讨论实习方向→焦虑→失眠。考试复习没开始。
- 我注意到什么（发现 / 情绪 / 学习）：你不回应导师的建议，而是跳到"要不要回体制内"——考编是你焦虑时的安全门，不是一条真正的路。SQL"比想象中容易"——又一次证明恐惧比事情大。
- 明天我自己能做的一个小动作：考试复习开始——哪怕只背半小时。

#### 如果还有余力
- 今天一个做得不错的地方：SQL学完，文献综述收掉了。
- 今天出现了什么"带刺的机会"或小提醒：失眠关键节点是"想体制内"——不是真的想去，是不想面对"自己杀出路"的恐惧。
- 这件事更深地指向了什么模式：每次面对不确定都摸同一个逃生门——考编。但门后什么都没有。需要练习在不确定中待着，不立刻找逃生门。

### 明日交接
- 明天最重要的 1 件事：考试复习开始
- 明天第二重要的 1 件事（可留空）：文献综述整合收尾
- 明天维护秩序的 1 件小事（可留空）：考编念头来了就让它来，不要跟它走

---
### ⚛️今日维护
#### 最低版本
- [x] 打开今天这页并写 3 行
- [x] 完成 1 段不聊天的专注时间
- [x] 留下 1 句晚间复盘

#### 可选加分
- [ ] 出门 / 走一走 / 晒太阳
- [ ] 拉伸或活动一下身体
- [x] 吃一点让自己开心的东西

#### AI 协作
- [ ] 今天主动用一次 Miroir 拆计划
- [ ] 今天主动用一次 Miroir 做复盘或整理

#### 记录项
- ⚡[energy::4]
- 📖[reading::SQL学习完成]
- 🧘🏻[meditation::]
- 🏋🏻‍♂️[workout::]

#### 不求全做
- 今天能完成 最低版本 就算没有掉线
---`,
  },
  {
    date: "2026-06-10",
    content: `---
date: '2026-06-10'
week: '2026-W24'
month: '2026-06'
quarter: '2026-Q2'
state:
  mood: anxious
  body: tight-shoulders
  occupying_thought: exam-pressure
  worth_today: start-sql
priorities:
  - text: 开始学SQL
    done: true
  - text: 推进文献综述
    done: false
  - text: 整理桌面
    done: true
tasks: []
quick_capture: []
energy: 3
reading: SQL教程
meditation: false
workout: false
maintenance:
  open_page: true
  focus_time: true
  review_line: true
  outdoor: false
  stretch: false
  treat: false
  ai_plan: false
  ai_review: false
review:
  facts: 终于开始学SQL了。上午焦虑了一整个小时才打开教程。实际学起来发现没那么难。文献综述又没推进。
  discoveries: 每次开始一个新东西前都有一个"拖延-焦虑"循环。但一旦开始了，那个恐惧就散掉了。需要记住的是一旦开始了就不难，不是下次不要怕。
  next_action: 继续SQL，同时文献综述只做一小段。
  did_well: 虽然拖拉了但最后还是打开了SQL教程。
  thorn: ''
  pattern: 开始新事物前的"焦虑-拖延-最后发现不难"循环。
handoff:
  primary: 继续SQL学习
  secondary: 文献综述一小段
  maintenance: 早点开始，不要等到焦虑
---

## 2026 / Q2 / June / Week 24
# DAILY NOTE
##### ❮ 2026-06-09 | 2026-06-10 | 2026-06-11 ❯
---

### 今日状态
- 此刻状态：焦虑，肩膀紧。又拖了一个小时才开始做事。
- 现在最占据我心里的事：考试越来越近，但课业也很重。
- 如果今天只认真过好一天，什么算值得？打开SQL教程，写完第一个查询。

### 📕自由书写

终于开始学SQL了。其实从上周就在想"要学SQL"——但一直拖着，一直怕。怕学不会，怕浪费时间，怕最后发现自己不适合。

结果今天打开教程，跟着写第一个 SELECT 语句——就这？就这样的？比想象中容易太多了。不到一小时把基本查询看完了。

我开始怀疑：自己之前到底在怕什么？怕的是SQL吗？还是怕"学一个新东西可能失败"这件事？可能后者更多。

恐惧比事情大。这句话之前写周记的时候写过，今天是活生生的例子。

### 晚间复盘
- 今天发生了什么（客观事实）：开始学SQL，实际比想象容易。文献综述没推进。
- 我注意到什么：开始新东西前的"焦虑-拖延-发现不难"循环又来了。需要记住的是"一旦开始了就不难"。
- 明天我自己能做的一个小动作：继续SQL，文献综述只做一小段。

### 明日交接
- 明天最重要的 1 件事：继续SQL学习
- 明天第二重要的 1 件事（可留空）：文献综述一小段
- 明天维护秩序的 1 件小事（可留空）：早点开始，不要等到焦虑
---`,
  },
  {
    date: "2026-06-07",
    content: `---
date: '2026-06-07'
week: '2026-W23'
month: '2026-06'
quarter: '2026-Q2'
state:
  mood: overwhelmed
  body: headache
  occupying_thought: too-many-tasks
  worth_today: pick-just-one
priorities:
  - text: 只做文献综述的开头段落
    done: true
  - text: ''
    done: false
  - text: ''
    done: false
tasks: []
quick_capture: []
energy: 2
reading: ''
meditation: false
workout: false
maintenance:
  open_page: true
  focus_time: false
  review_line: true
  outdoor: true
  stretch: false
  treat: false
  ai_plan: false
  ai_review: false
review:
  facts: 周一。任务列表很满，一个都不想开始。最后只做了文献综述的开头段落——但确实做了一点。
  discoveries: 今天学到一件事：不是"所有任务都要做"，而是"今天只做一件就算赢"。把期望从"全部完成"降到"完成了至少一件"，焦虑就降了很多。
  next_action: 明天继续文献综述，争取写完第一小节。
  did_well: 虽然状态很差，但还是做了点什么。
  thorn: ''
  pattern: 任务太多→焦虑→一个都不想开始→最后什么都没做。今天打破了——虽然只做了一件，但比什么都不做好。
handoff:
  primary: 继续文献综述第一小节
  secondary: ''
  maintenance: 如果明天也很累，只做一件也算赢
---

## 2026 / Q2 / June / Week 23
# DAILY NOTE

### 今日状态
- 此刻状态：被压垮的感觉。头疼。
- 现在最占据我心里的事：太多事要做，不知道从哪开始。
- 如果今天只认真过好一天，什么算值得？只完成文献综述的开头段落。

### 📕自由书写

周一综合症。周末没有休息好，今天一打开任务列表就想关掉。考试、论文、阅读——每一件都像山一样大。

在桌前坐了一个小时什么都没做。最后跟自己讨价还价：只写文献综述的第一段，写完就可以休息。结果居然写完了。虽然只是开头，但至少不是零。

我发现"只做一件就算赢"这个策略确实有效。把门槛降得足够低，低到不可能失败。

### 晚间复盘
- 今天发生了什么：周一。任务满，一个都不想开始。只完成了文献综述的开头段落。
- 我注意到什么：把期望从"全部完成"降到"完成至少一件"，焦虑就降了很多。
- 明天我自己能做的一个小动作：继续文献综述，争取写完第一小节。

### 明日交接
- 明天最重要的 1 件事：继续文献综述第一小节
- 明天维护秩序的 1 件小事：如果明天也很累，只做一件也算赢
---`,
  },
]

async function seed() {
  await fs.mkdir(JOURNAL_DIR, { recursive: true })

  for (const entry of DEMO_ENTRIES) {
    const filePath = path.join(JOURNAL_DIR, `${entry.date}.md`)
    await fs.writeFile(filePath, entry.content, "utf-8")
    console.log(`✓ Created ${entry.date}.md`)
  }

  console.log(`\nSeeded ${DEMO_ENTRIES.length} journal entries to ${JOURNAL_DIR}`)
}

seed().catch(console.error)
