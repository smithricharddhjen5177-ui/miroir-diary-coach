"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const PROMPT_CATEGORIES = [
  {
    title: "☀️ 晨间日记",
    description: "每天清晨设定一天的意图。",
    prompts: [
      "今天将是美好的一天。",
      "今天，我最想体验的一件事是什么？",
      "如果今天只做一件事让它变得值得，那件事是什么？",
      "今天我想以什么样的状态度过这一天？",
    ],
  },
  {
    title: "💭 心情日记（表达性写作）",
    description: "记录情绪、感受、想法。不用有条理，想到什么写什么。",
    prompts: [
      "今天发生了什么让我情绪波动的事？",
      "今天哪个瞬间让我感觉最有活力？",
      "如果用三个词形容今天的心情，是什么？",
      "今天的身体有什么感觉？紧绷、放松、疲惫还是充沛？",
      "今天做了什么事？这些事让我感觉怎么样？",
      "今天发生的一件事如何影响了我的心情？我可以如何更积极地应对？",
    ],
  },
  {
    title: "📖 生活故事",
    description: "找出今天最有故事价值的一件事。",
    prompts: [
      "今天发生在我身上的最有故事价值的事情是什么？",
      "能以此为素材，讲五分钟的故事吗？主角是谁？起承转合是什么？",
      "今天有哪个瞬间是我希望永远记住的？",
      "今天发生的哪件事，十年后我可能还会讲给别人听？",
    ],
  },
  {
    title: "🙏 感恩日记",
    description: "关注生活中发生的美好的事情。",
    prompts: [
      "今天我最感激的三件事是什么？",
      "我很感谢谁？描述这个人的三个品质。这些品质在什么时候展现出来了？",
      "今天有什么小事让我感到温暖或被关心？",
      "我很感激我的生命中有你——试着把这句话发给你感激的人。",
    ],
  },
  {
    title: "🧭 决策日记",
    description: "决策导向行动，行动导向结果。",
    prompts: [
      "我应该做什么？我想做什么决定？此时此地我应该采取什么行动？",
      "如果我继续照这条路走下去，5年后我的生活会是什么样子？",
      "如果我走一条完全不同的路，同时不用在乎钱和别人眼光，5年后呢？",
      "12个月后，在生活的不同方面，我想和朋友一起庆祝什么？（如每周健身三次、第一次创业、要求加薪……）",
    ],
  },
  {
    title: "😨 恐惧练习",
    description: "面对那些让你不敢行动的事情。",
    prompts: [
      "如果做了最害怕的事情，最坏的结果是什么样子？",
      "我能做些什么事情来防止最坏的事情发生？",
      "如果最坏的事情发生了，我能用什么去弥补它？",
      "如果我只做了一点，甚至取得了小小的成功，我能获得什么？",
      "如果我害怕的事情一件不做，半年、一年、三年之后我的生活会怎么样？",
      "向 85 岁的自己寻求建议：现在我该怎么做？",
    ],
  },
  {
    title: "🎡 生命之轮",
    description: "十项维度的自我评估，找到需要关注的领域。",
    prompts: [
      "身体、心理、健康、职业、收入、成长、爱情、家庭、友谊、意义——每项打几分（1-10）？",
      "如果只有三分，不必苛责自己——怎么提升到五分？",
      "哪一项的提升会对其他维度产生最大的正面影响？",
      "12 月想庆祝什么？过程中的每一步也值得享受。",
    ],
  },
]

export default function PromptsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">提示词库</h1>
        <p className="text-sm text-muted-foreground mt-1">
          所有日记提示词来自视频框架。点击任意提示词可复制到剪贴板，用在任何日记中。
        </p>
      </div>

      <div className="space-y-6">
        {PROMPT_CATEGORIES.map((cat) => (
          <Card key={cat.title}>
            <CardHeader>
              <CardTitle className="text-base">{cat.title}</CardTitle>
              <CardDescription>{cat.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {cat.prompts.map((p) => (
                  <Badge
                    key={p}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary/20 text-sm font-normal px-3 py-1.5"
                    onClick={() => { navigator.clipboard.writeText(p) }}
                    title="点击复制到剪贴板"
                  >
                    {p}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-xs text-muted-foreground text-center pb-8">
        点击任意提示词即可复制。回到日记页面粘贴使用。
      </p>
    </div>
  )
}
