/**
 * Seed script: create demo journal entries for development/testing.
 * All content is fictional — no real personal data.
 * Run with: npx tsx scripts/seed.ts
 */
import fs from "fs/promises"
import path from "path"

const JOURNAL_DIR = path.join(process.cwd(), "content", "journal")

// Fully fictional demo entries for development/testing
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
  body: tight-shoulders
  occupying_thought: weekly-review-prep
  worth_today: finish-weekly-planning
priorities:
  - text: 完成本周工作总结
    done: true
  - text: 阅读一篇行业文章
    done: false
  - text: 散步30分钟
    done: true
tasks:
  - text: 整理项目进展
    done: true
  - text: 回复重要邮件
    done: true
  - text: 计划下周重点
    done: false
quick_capture:
  - 想到一个新项目的点子，先记下来
energy: 3
reading: 行业趋势报告
meditation: false
workout: true
maintenance:
  open_page: true
  focus_time: true
  review_line: true
  outdoor: true
  stretch: false
  treat: false
  ai_plan: true
  ai_review: true
review:
  facts: 周一。完成了本周工作总结，回复了积压邮件。下午效率下降，计划下周重点的任务没完成。
  discoveries: 下午三点后注意力明显下降，以后可以把重要任务集中在上午。散步对于恢复精力比想象中有用。
  next_action: 明天先处理最重要的那件事，不要从邮件开始。
  did_well: 完成工作总结的质量不错，结构清晰。
  thorn: 下午效率下降得比预期快，可能需要调整作息。
  pattern: 注意到自己有一种倾向：在状态好的时候想"再多做一点"，然后反而透支，第二天状态更差。
handoff:
  primary: 完成下周计划
  secondary: 阅读那篇行业文章
  maintenance: 下午三点后安排休息或散步
---

## 2026 / Q2 / June / Week 25
# DAILY NOTE
##### ❮ 2026-06-14 | 2026-06-15 | 2026-06-16 ❯
---

### 今日状态
- 此刻状态：有点累，肩膀紧。周末没休息好。
- 现在最占据我心里的事：想把一周的工作做一个清晰的总结。
- 如果今天只认真过好一天，什么算值得？完成工作总结，知道自己这周到底推进了什么。

### 今日重点
- [x] 最重要的 1 件事：完成本周工作总结
- [ ] 第二重要的 1 件事：阅读一篇行业文章
- [x] 维护生活秩序的 1 件小事：散步30分钟

### 今日任务
- [x] 任务 1：整理项目进展
- [x] 任务 2：回复重要邮件
- [ ] 任务 3：计划下周重点

### 快速收纳
- 想到一个新项目的点子，先记下来

### 📕自由书写

周一。上午状态不错，把一周的工作总结写完了。整理的过程中发现其实推进了不少东西，只是平时忙起来没感觉。

下午效率明显下降。三点之后就很难集中注意力了，本来想"再多做一点"，但强迫自己出去散了半小时步。回来之后好了一点，但也没恢复到上午的状态。

这让我想到一个问题：是不是应该把最重要的任务保护在上午？而不是任由邮件和杂事占用精力最充沛的时段。

另外，散步的时候突然想到一个新项目的点子——有时候最好的想法不是在桌前产生的。

### 晚间复盘
> 先写事实，再写发现，再写一个你明天自己能做的小动作。只写 1 到 3 行也算完成。

#### 最低复盘
- 今天发生了什么（客观事实）：完成工作总结，回复了积压邮件。下午效率下降，下周计划没完成。
- 我注意到什么（发现 / 情绪 / 学习）：下午三点后注意力下降，散步有助于恢复。重要任务应保护在上午。
- 明天我自己能做的一个小动作：明天先做最重要的那件事，不要从邮件开始。

#### 如果还有余力
- 今天一个做得不错的地方：工作总结质量不错，结构清晰。
- 今天出现了什么"带刺的机会"或小提醒：下午效率下降得比预期快，作息可能需要调整。
- 这件事更深地指向了什么模式：状态好的时候想"再多做一点"，结果透支，第二天更差。

### 明日交接
- 明天最重要的 1 件事：完成下周计划
- 明天第二重要的 1 件事（可留空）：阅读行业文章
- 明天维护秩序的 1 件小事（可留空）：下午三点后安排休息或散步

---
### ⚛️今日维护
#### 最低版本
- [x] 打开今天这页并写 3 行
- [x] 完成 1 段不聊天的专注时间
- [x] 留下 1 句晚间复盘

#### 可选加分
- [x] 出门 / 走一走 / 晒太阳
- [ ] 拉伸或活动一下身体
- [ ] 吃一点让自己开心的东西

#### AI 协作
- [x] 今天主动用一次 Miroir 拆计划
- [x] 今天主动用一次 Miroir 做复盘或整理

#### 记录项
- ⚡[energy::3]
- 📖[reading::行业趋势报告]
- 🧘🏻[meditation::]
- 🏋🏻‍♂️[workout::yes]

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
  mood: peaceful
  body: relaxed
  occupying_thought: weekend-rest
  worth_today: write-weekly-review
priorities:
  - text: 写一周回顾
    done: true
  - text: 整理书桌
    done: true
  - text: 给朋友打电话
    done: false
tasks:
  - text: 周回顾写作
    done: true
  - text: 整理房间
    done: true
  - text: 打电话
    done: false
quick_capture: []
energy: 6
reading: ''
meditation: true
workout: false
maintenance:
  open_page: true
  focus_time: true
  review_line: true
  outdoor: false
  stretch: true
  treat: true
  ai_plan: false
  ai_review: false
review:
  facts: 周日。睡到自然醒。写了一周的回顾，发现这周其实挺充实的——完成了一个小项目的交付，看了两篇有价值的技术文章。房间也整理干净了。
  discoveries: 周日不做任何"必须做的事"，只是回顾和整理，这种节奏让人感到平静和掌控感。一周里有一天完全属于自己，不是奢侈品，是必需品。
  next_action: 新的一周想在每天下午安排一段不被打扰的深度工作时间。
  did_well: 周回顾写得不错，不是流水账，而是真的找到了这周的亮点和需要改进的地方。
  thorn: ''
  pattern: 当一周有清晰的可交付成果时，周末回顾就特别有满足感。以后可以在周初设定明确的"本周要交付什么"。
handoff:
  primary: 为新的一周设定明确的交付目标
  secondary: 尝试下午深度工作时段
  maintenance: 晚上十一点前睡觉
---

## 2026 / Q2 / June / Week 24
# DAILY NOTE
##### ❮ 2026-06-13 | 2026-06-14 | 2026-06-15 ❯
---

### 今日状态
- 此刻状态：平静、放松。睡到自然醒的一天。
- 现在最占据我心里的事：想好好回顾这一周。
- 如果今天只认真过好一天，什么算值得？写完周回顾，整理好房间。

### 今日重点
- [x] 最重要的 1 件事：写一周回顾
- [x] 第二重要的 1 件事：整理书桌
- [ ] 维护生活秩序的 1 件小事：给朋友打电话

### 今日任务
- [x] 任务 1：周回顾写作
- [x] 任务 2：整理房间
- [ ] 任务 3：打电话

### 快速收纳

### 📕自由书写

周日。睡到自然醒，没有闹钟。这种不赶时间的感觉真好。

上午翻看这周的日记。周一收到一个紧急需求，周三交付了一个小模块，周四和同事讨论了架构重构的方向——周五因为太累了几乎没做什么，但总体来说这周是充实的。看了两篇行业文章，颇有收获。

下午整理房间，把书桌收拾干净了。环境清爽了，心情也清爽了。

我发现周日用来做回顾和整理，而不是赶任务，是一种很好的节奏。一周里有一天完全属于自己——不是奢侈品，是必需品。

### 晚间复盘
> 先写事实，再写发现，再写一个你明天自己能做的小动作。

#### 最低复盘
- 今天发生了什么（客观事实）：周日。写了周回顾。整理了房间。没有赶任务。
- 我注意到什么（发现 / 情绪 / 学习）：周日不赶任务只回顾，这种节奏带来平静和掌控感。一周里有一天属于自己是必需品。
- 明天我自己能做的一个小动作：为新的一周设定明确的交付目标。

#### 如果还有余力
- 今天一个做得不错的地方：周回顾不是流水账，找到了亮点和改进点。
- 今天出现了什么"带刺的机会"或小提醒：

### 明日交接
- 明天最重要的 1 件事：为新的一周设定明确的交付目标
- 明天第二重要的 1 件事（可留空）：尝试下午深度工作时段
- 明天维护秩序的 1 件小事（可留空）：晚上十一点前睡觉

---
### ⚛️今日维护
#### 最低版本
- [x] 打开今天这页并写 3 行
- [x] 完成 1 段不聊天的专注时间
- [x] 留下 1 句晚间复盘

#### 可选加分
- [ ] 出门 / 走一走 / 晒太阳
- [x] 拉伸或活动一下身体
- [x] 吃一点让自己开心的东西

#### AI 协作
- [ ] 今天主动用一次 Miroir 拆计划
- [ ] 今天主动用一次 Miroir 做复盘或整理

#### 记录项
- ⚡[energy::6]
- 📖[reading::]
- 🧘🏻[meditation::yes]
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
  mood: productive
  body: ''
  occupying_thought: learning-new-tool
  worth_today: try-new-tool
priorities:
  - text: 尝试用新工具解决那个数据分析问题
    done: true
  - text: 整理项目文档
    done: false
  - text: 午休
    done: true
tasks:
  - text: 学新工具
    done: true
  - text: 整理文档
    done: false
  - text: ''
    done: false
quick_capture: []
energy: 5
reading: ''
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
  facts: 一直想学的新工具，今天终于上手了。原以为很难，结果一小时跑通了基本流程。项目文档整理又没做。
  discoveries: 每次面对新工具新技能之前都有一种"怕学不会"的恐惧，但每次实际开始之后都发现没那么难。恐惧本身比要学的东西更大。需要记住的不是"下次不要怕"，而是"上次也怕过，最后还是学会了"。
  next_action: 明天用新工具继续分析数据，顺便补一章文档。
  did_well: 虽然拖拉了几周，但今天终于打开了新工具。
  thorn: 一直在逃避的文档整理又没做。
  pattern: 学习新东西前的"焦虑-拖延-发现不难"循环。这个模式出现好几次了，每次结局都一样。
handoff:
  primary: 用新工具继续数据分析
  secondary: 补一章项目文档
  maintenance: 学了新东西，奖励自己一杯好咖啡
---

## 2026 / Q2 / June / Week 24
# DAILY NOTE
##### ❮ 2026-06-09 | 2026-06-10 | 2026-06-11 ❯
---

### 今日状态
- 此刻状态：期待中带点紧张。终于要尝试那个新工具了。
- 现在最占据我心里的事：能不能学会？会不会浪费时间？
- 如果今天只认真过好一天，什么算值得？跑通新工具的基本流程。

### 今日重点
- [x] 最重要的 1 件事：尝试用新工具解决数据分析问题
- [ ] 第二重要的 1 件事：整理项目文档
- [x] 维护生活秩序的 1 件小事：午休

### 📕自由书写

终于上手了那个想了几周的新工具。安装、配置、跑通基本流程——比想象中顺利太多了。一小时内完成了本来以为要花一天的事情。

这让我想起去年学其他工具的时候也是同样的感觉——学之前觉得是天堑，学之后觉得不过是几步操作。恐惧比事情大。每次都是这样。

但项目文档又没整理。这件事已经推了三周了。也许不是"没有时间"，而是"整理文档"这整件事太模糊了——不知道从哪里开始，要写多少算完。下次可以试着切成"只整理一个函数"、"只补一段说明"这样的小块。

### 晚间复盘
- 今天发生了什么（客观事实）：上手新工具，一小时跑通。文档整理又没做。
- 我注意到什么（发现 / 情绪 / 学习）：学习新工具前总有"怕学不会"的恐惧，但每次结果都一样——没那么难。恐惧本身比事情大。
- 明天我自己能做的一个小动作：用新工具继续分析，顺便补一章文档。

### 明日交接
- 明天最重要的 1 件事：用新工具继续数据分析
- 明天第二重要的 1 件事（可留空）：补一章项目文档
- 明天维护秩序的 1 件小事（可留空）：学了新东西，奖励自己一杯好咖啡
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
  occupying_thought: too-much-to-do
  worth_today: just-do-one-thing
priorities:
  - text: 完成项目提案的第一段
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
  ai_review: true
review:
  facts: 周一。任务堆了很多，一个都不想动。最后只完成了项目提案的开头段落。
  discoveries: 把心态从"今天必须全部做完"调整到"今天只做一件就算赢"之后，压力减轻了很多。而且做完一件之后其实比预想中好——至少不是零。降低期望不是妥协，是一种策略。
  next_action: 明天继续项目提案，争取写完第一小节。
  did_well: 虽然状态差，但还是完成了至少一件事。
  thorn: 任务堆积通常不是事情太多，而是每个任务都太模糊——不知道怎么开始。
  pattern: 任务模糊→焦虑→一个都不想开始→什么都不做→更焦虑。但今天打破了这个循环，因为把目标从"全部完成"降到了"完成一件"。
handoff:
  primary: 继续项目提案第一小节
  secondary: ''
  maintenance: 如果明天也很累，只做一件也算赢
---

## 2026 / Q2 / June / Week 23
# DAILY NOTE
##### ❮ 2026-06-06 | 2026-06-07 | 2026-06-08 ❯
---

### 今日状态
- 此刻状态：被压垮的感觉，头疼。
- 现在最占据我心里的事：要把项目提案写完，还要整理数据、回邮件、更新文档。
- 如果今天只认真过好一天，什么算值得？完成提案的开头段落。

### 📕自由书写

周一。打开任务列表就头疼。看起来每件事都很重要，每件事都很急，每件事都很大。

在桌前坐了一个多小时，什么都没做。翻来覆去地想"该先做哪个"——结果一个都没做。

最后跟自己做了一个交易：只写项目提案的第一段，写完就可以休息。居然写完了。虽然只是开头，但至少不是零。下午还出去晒了十分钟太阳，头疼好了一点。

想到之前读到的一句话："如果你觉得一件事很难开始，说明你把它的门槛设得太高了。"今天验证了这句话——把目标从"完成提案"变成"写完开头段落"，门槛就低到能跨过去了。

### 晚间复盘
- 今天发生了什么：任务太多不想动，只完成了项目提案开头段落。
- 我注意到什么：把心态从"全部完成"降到"完成一件就算赢"，压力大大减轻。降低期望不是妥协，是一种策略。
- 明天我自己能做的一个小动作：继续项目提案，争取写完第一小节。

### 明日交接
- 明天最重要的 1 件事：继续项目提案第一小节
- 明天维护秩序的 1 件小事：任务太模糊时先切成15分钟能完成的小块
---`,
  },
  {
    date: "2026-06-03",
    content: `---
date: '2026-06-03'
week: '2026-W23'
month: '2026-06'
quarter: '2026-Q2'
state:
  mood: energized
  body: good
  occupying_thought: project-kickoff
  worth_today: define-project-scope
priorities:
  - text: 确定新项目范围和目标
    done: true
  - text: 和团队对齐时间线
    done: true
  - text: 运动
    done: true
tasks:
  - text: 项目范围文档
    done: true
  - text: 团队沟通
    done: true
  - text: 跑步
    done: true
quick_capture:
  - 下周可以约一个技术分享
energy: 8
reading: ''
meditation: false
workout: true
maintenance:
  open_page: true
  focus_time: true
  review_line: true
  outdoor: true
  stretch: true
  treat: true
  ai_plan: false
  ai_review: false
review:
  facts: 周三。新项目 kickoff。确定了范围和目标文档，和团队对齐了时间线。晚上跑了5公里。
  discoveries: 当目标是"今天要跑5公里"而不是"今天要运动"时，完成率高得多。量化目标是提高执行力的简单方法。
  next_action: 明天开始做项目的第一批任务分解。
  did_well: 项目 kickoff 很顺利，沟通到位。
  thorn: ''
  pattern: 高能量日通常有三个特征：睡眠充足、目标清晰、有运动。
handoff:
  primary: 项目第一批任务分解
  secondary: 预约下周技术分享
  maintenance: 保持睡眠充足
---

## 2026 / Q2 / June / Week 23
# DAILY NOTE
##### ❮ 2026-06-02 | 2026-06-03 | 2026-06-04 ❯
---

### 今日状态
- 此刻状态：精力充沛，状态很好。
- 现在最占据我心里的事：新项目 kickoff，想把范围定清楚。
- 如果今天只认真过好一天，什么算值得？确定项目范围，团队对齐。

### 今日重点
- [x] 最重要的 1 件事：确定新项目范围和目标
- [x] 第二重要的 1 件事：和团队对齐时间线
- [x] 维护生活秩序的 1 件小事：运动

### 今日任务
- [x] 任务 1：项目范围文档
- [x] 任务 2：团队沟通
- [x] 任务 3：跑步

### 📕自由书写

今天是一个高能量日。早上起来感觉很好——昨晚睡了八个多小时，没有闹钟自然醒。

新项目 kickoff。花了一上午写范围文档，把要做的事和不做的事都写清楚了。下午和团队对齐时间线，大家的反馈很积极。这种感觉很好——有目标、有进展、有支持。

晚上跑了 5 公里。上次跑还是上周——中间断了几天。

回顾今天：睡眠充足 + 目标清晰 + 有运动 = 高能量日。这个公式值得记住。

### 晚间复盘
- 今天发生了什么：新项目 kickoff，范围和目标确定。团队对齐。跑了5公里。
- 我注意到什么：量化目标比模糊目标更容易完成。"跑5公里"比"运动"有效得多。
- 明天我自己能做的一个小动作：开始做项目的第一批任务分解。

### 明日交接
- 明天最重要的 1 件事：项目第一批任务分解
- 明天第二重要的 1 件事（可留空）：预约下周技术分享
- 明天维护秩序的 1 件小事（可留空）：保持睡眠充足
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

  console.log(`\nSeeded ${DEMO_ENTRIES.length} fictional demo entries to ${JOURNAL_DIR}`)
  console.log("All content is fictional — no real personal data.")
}

seed().catch(console.error)
