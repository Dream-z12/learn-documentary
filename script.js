"use client"

const subjects = [
  {
    name: "高等数学",
    exam: "2026/07/20",
    days: 53,
    completed: 8,
    total: 12,
    chapters: [
      { title: "极限与连续", done: true },
      { title: "导数与微分", done: true },
      { title: "积分应用", done: false },
      { title: "微分方程", done: false },
    ],
  },

  {
    name: "CS61A",
    exam: "2026/06/18",
    days: 21,
    completed: 11,
    total: 15,
    chapters: [
      { title: "Recursion", done: true },
      { title: "Tree Recursion", done: true },
      { title: "Generators", done: true },
      { title: "Scheme", done: false },
    ],
  },

  {
    name: "人工智能",
    exam: "2026/07/02",
    days: 35,
    completed: 5,
    total: 14,
    chapters: [
      { title: "机器学习基础", done: true },
      { title: "神经网络", done: false },
      { title: "Transformer", done: false },
      { title: "LLM Agent", done: false },
    ],
  },
]

export default function Page() {
  return (
    <main className="min-h-screen bg-[#07111d] overflow-hidden text-white relative">
      {/* Background Glow */}
      <div className="absolute top-[-150px] left-[-100px] w-[500px] h-[500px] bg-cyan-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-150px] right-[-100px] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-10 pt-10">
        <div>
          <h1 className="text-4xl font-semibold tracking-wide">
            Glacier Study Space
          </h1>

          <p className="text-white/50 mt-2">
            冰川蔚蓝学习系统
          </p>
        </div>

        <button className="px-5 py-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl hover:bg-white/15 transition">
          + 添加科目
        </button>
      </header>

      {/* Subject Board */}
      <section className="relative z-10 mt-12 px-10 overflow-x-auto">
        <div className="flex gap-8 min-w-max pb-10">
          {subjects.map((subject, index) => {
            const progress = Math.round(
              (subject.completed / subject.total) * 100
            )

            return (
              <div
                key={index}
                className="w-[360px] shrink-0 rounded-[34px] border border-white/15 bg-white/10 backdrop-blur-2xl p-7 relative overflow-hidden"
              >
                {/* Card Glow */}
                <div className="absolute top-[-60px] right-[-60px] w-[160px] h-[160px] rounded-full bg-cyan-300/20 blur-3xl" />

                <div className="relative z-10">
                  {/* Top */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold">
                        {subject.name}
                      </h2>

                      <p className="text-white/40 text-sm mt-1">
                        考试时间 · {subject.exam}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-white/40">
                        距离考试
                      </p>

                      <h3 className="text-3xl font-bold text-cyan-200 mt-1">
                        {subject.days}
                      </h3>

                      <p className="text-xs text-white/40">
                        DAYS
                      </p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mt-8">
                    <div className="flex justify-between text-sm text-white/60 mb-3">
                      <span>章节完成率</span>

                      <span>{progress}%</span>
                    </div>

                    <div className="w-full h-[10px] bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-blue-500 transition-all duration-700"
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Chapters */}
                  <div className="mt-8 space-y-3">
                    {subject.chapters.map((chapter, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-2xl px-4 py-3 border border-white/10 bg-white/5 backdrop-blur-lg"
                      >
                        <div>
                          <p className="text-sm">
                            {chapter.title}
                          </p>

                          <p className="text-xs text-white/35 mt-1">
                            Knowledge Review
                          </p>
                        </div>

                        <div
                          className={`w-5 h-5 rounded-full border ${
                            chapter.done
                              ? "bg-cyan-300 border-cyan-200"
                              : "border-white/30"
                          }`}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Button */}
                  <button className="w-full mt-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400/80 to-blue-500/80 hover:opacity-90 transition-all">
                    进入学科工作舱
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </main>
  )
}
