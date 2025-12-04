'use client'

import { useEffect } from 'react'

export default function ProficiencySection() {
  useEffect(() => {
    // 数字动画函数 - 从0计数到目标值
    function animateNumber(
      element: HTMLElement,
      target: number,
      duration = 2000
    ) {
      const start = 0
      const startTime = performance.now()

      function update(currentTime: number) {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)

        // 使用缓动函数
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        const current = Math.floor(start + (target - start) * easeOutQuart)

        element.textContent = current.toString()

        if (progress < 1) {
          requestAnimationFrame(update)
        } else {
          element.textContent = target.toString()
        }
      }

      requestAnimationFrame(update)
    }

    // 圆环进度条动画函数
    function animateCircularProgress(
      circle: SVGCircleElement,
      percentage: number,
      duration = 2000
    ) {
      const circumference = parseFloat(
        circle.getAttribute("data-circumference") || "502.65"
      )
      const startTime = performance.now()
      const offset = circumference

      function update(currentTime: number) {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)

        // 使用缓动函数
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        const currentPercentage = percentage * easeOutQuart
        const currentOffset =
          circumference - (currentPercentage / 100) * circumference

        circle.style.strokeDashoffset = currentOffset.toString()

        if (progress < 1) {
          requestAnimationFrame(update)
        } else {
          circle.style.strokeDashoffset = (
            circumference -
            (percentage / 100) * circumference
          ).toString()
        }
      }

      requestAnimationFrame(update)
    }

    // 使用 Intersection Observer 检测滚动
    const proficiencySection = document.getElementById("proficiency-section")
    let hasAnimated = false

    if (proficiencySection) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasAnimated) {
              hasAnimated = true

              // 获取所有技能卡片
              const skillCards =
                proficiencySection.querySelectorAll(".skill-card")

              skillCards.forEach((card, index) => {
                setTimeout(() => {
                  const percentageElement = card.querySelector(
                    ".skill-percentage"
                  ) as HTMLElement
                  const progressCircle = card.querySelector(
                    ".progress-ring-circle"
                  ) as SVGCircleElement
                  const percentage = parseInt(
                    card.getAttribute("data-percentage") || "0"
                  )

                  if (percentageElement && progressCircle) {
                    // 启动数字动画
                    animateNumber(percentageElement, percentage)

                    // 启动圆环动画
                    animateCircularProgress(progressCircle, percentage)
                  }
                }, index * 150) // 每个技能延迟150ms，形成依次动画效果
              })
            }
          })
        },
        {
          threshold: 0.3, // 当30%的区域可见时触发
        }
      )

      observer.observe(proficiencySection)
    }
  }, [])

  const skills = [
    { name: "React", percentage: 95, colorClass: "skill-color-1", nameClass: "skill-name-1", gradientId: "gradient-1" },
    { name: "JavaScript", percentage: 90, colorClass: "skill-color-2", nameClass: "skill-name-2", gradientId: "gradient-2" },
    { name: "TypeScript", percentage: 88, colorClass: "skill-color-3", nameClass: "skill-name-3", gradientId: "gradient-3" },
    { name: "Vue.js", percentage: 85, colorClass: "skill-color-4", nameClass: "skill-name-4", gradientId: "gradient-4" },
    { name: "Node.js", percentage: 92, colorClass: "skill-color-5", nameClass: "skill-name-5", gradientId: "gradient-5" },
    { name: "CSS", percentage: 87, colorClass: "skill-color-6", nameClass: "skill-name-6", gradientId: "gradient-6" },
  ]

  const gradientStops = [
    { id: "gradient-1", stops: ["#9dddd4", "#88d4c9", "#76cfc5"] },
    { id: "gradient-2", stops: ["#ffd966", "#ffc933", "#ffb400"] },
    { id: "gradient-3", stops: ["#e88b8b", "#ea7876", "#ec6664"] },
    { id: "gradient-4", stops: ["#e88b8b", "#ea7876", "#ec6664"] },
    { id: "gradient-5", stops: ["#9dddd4", "#88d4c9", "#76cfc5"] },
    { id: "gradient-6", stops: ["#ffd966", "#ffc933", "#ffb400"] },
  ]

  return (
    <section className="proficiency-section" id="proficiency-section">
      <div className="proficiency-content">
        <h2 className="proficiency-title">Proficiency</h2>
        <div className="skills-grid">
          {skills.map((skill, index) => (
            <div key={skill.name} className="skill-card" data-percentage={skill.percentage}>
              <div className={`skill-name ${skill.nameClass}`}>{skill.name}</div>
              <div className="circular-progress">
                <svg className="progress-ring" width="180" height="180">
                  <circle
                    className="progress-ring-circle-bg"
                    stroke="#f0f0f0"
                    strokeWidth="10"
                    fill="transparent"
                    r="80"
                    cx="90"
                    cy="90"
                  />
                  <circle
                    className="progress-ring-circle"
                    stroke={`url(#${skill.gradientId})`}
                    strokeWidth="10"
                    fill="transparent"
                    r="80"
                    cx="90"
                    cy="90"
                    strokeDasharray="502.65"
                    strokeDashoffset="502.65"
                    data-circumference="502.65"
                  />
                  <defs>
                    <linearGradient
                      id={skill.gradientId}
                      gradientUnits="userSpaceOnUse"
                      x1="90"
                      y1="10"
                      x2="170"
                      y2="90"
                    >
                      <stop offset="0%" style={{ stopColor: gradientStops[index].stops[0], stopOpacity: 1 }} />
                      <stop offset="50%" style={{ stopColor: gradientStops[index].stops[1], stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: gradientStops[index].stops[2], stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                </svg>
                <div className={`circular-progress-text ${skill.colorClass}`}>
                  <span className="skill-percentage" data-target={skill.percentage}>0</span>%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

