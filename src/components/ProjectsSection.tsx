'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { projectsConfig } from '../config/projects'

export default function ProjectsSection() {
  const carouselUlRef = useRef<HTMLUListElement>(null)
  const descriptionTrackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const carouselUl = carouselUlRef.current
    const carouselContainer = carouselUl?.parentElement
    const items = carouselUl?.querySelectorAll('.ticker-item')
    const images = carouselUl?.querySelectorAll('.coverflow-item')

    if (!carouselUl || !carouselContainer || !items || !images) {
      console.error('Projects carousel elements not found')
      return
    }

    const descriptionTrack = descriptionTrackRef.current
    const descriptionViewport = document.querySelector('.project-description-viewport') as HTMLElement
    let currentProjectIndex = 0
    let isScrolling = false
    let currentTranslateY = 0

    function initializeDescriptionPosition() {
      if (!descriptionTrack || !descriptionViewport) return

      const items = descriptionTrack.querySelectorAll('.project-content-item')
      if (items.length === 0) return

      const firstItem = items[0] as HTMLElement
      if (firstItem) {
        requestAnimationFrame(() => {
          const firstItemTop = firstItem.offsetTop
          currentTranslateY = -firstItemTop
          if (descriptionTrack) {
            descriptionTrack.style.transform = `translateY(${currentTranslateY}px)`
          }
        })
      }
    }

    function updateProjectDescription(projectIndex: number) {
      if (!descriptionTrack || !descriptionViewport || isScrolling) return
      if (projectIndex === currentProjectIndex) return

      const items = descriptionTrack.querySelectorAll('.project-content-item')
      if (items.length === 0) return

      if (projectIndex < 0 || projectIndex >= items.length) return

      const targetItem = items[projectIndex] as HTMLElement
      if (!targetItem) return

      const targetItemTop = targetItem.offsetTop
      const targetY = -targetItemTop

      isScrolling = true
      const startY = currentTranslateY
      const startTime = performance.now()
      const duration = 500

      function animateScroll(currentTime: number) {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)

        const easeInOutCubic = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2

        currentTranslateY = startY + (targetY - startY) * easeInOutCubic
        if (descriptionTrack) {
          descriptionTrack.style.transform = `translateY(${currentTranslateY}px)`
        }

        if (progress < 1) {
          requestAnimationFrame(animateScroll)
        } else {
          currentTranslateY = targetY
          currentProjectIndex = projectIndex
          isScrolling = false
        }
      }

      requestAnimationFrame(animateScroll)
    }

    const itemWidth = 350
    const gap = 0
    const totalItems = items.length
    const cloneCount = totalItems

    // Create clones
    for (let i = 0; i < cloneCount; i++) {
      const originalItem = items[i]
      const clone = originalItem.cloneNode(true) as HTMLElement
      clone.classList.add('clone-item')
      clone.setAttribute('data-clone-index', i.toString())
      clone.setAttribute('data-original-index', i.toString())
      clone.setAttribute('aria-hidden', 'true')
      carouselUl.insertBefore(clone, items[0])
    }

    for (let i = 0; i < cloneCount; i++) {
      const originalItem = items[i]
      const clone = originalItem.cloneNode(true) as HTMLElement
      clone.classList.add('clone-item')
      clone.setAttribute('data-clone-index', i.toString())
      clone.setAttribute('data-original-index', i.toString())
      clone.setAttribute('aria-hidden', 'true')
      carouselUl.appendChild(clone)
    }

    const allItems = carouselUl.querySelectorAll('.ticker-item')
    const allImages = carouselUl.querySelectorAll('.coverflow-item')
    const totalVirtualItems = totalItems * 3

    let currentX = 0
    let isDragging = false
    let startX = 0
    let startScrollLeft = 0
    let velocity = 0
    let lastX = 0
    let lastTime = 0
    let animationFrameId: number | null = null
    let dragDistance = 0
    let clickedItemIndex: number | null = null
    let autoPlayTimer: number | null = null
    let isAutoPlaying = true
    const autoPlayInterval = 4000
    let lastProjectIndex = -1

    function getOffset(itemIndex: number, scrollX: number) {
      if (!carouselContainer) return 0
      const containerCenter = carouselContainer.offsetWidth / 2
      const itemStart = itemIndex * (itemWidth + gap)
      const itemCenterX = itemStart + scrollX + itemWidth / 2
      return itemCenterX - containerCenter
    }

    function lerp(
      input: number,
      inputRange: number[],
      outputRange: (number | string)[]
    ) {
      if (input <= inputRange[0]) return outputRange[0]
      if (input >= inputRange[inputRange.length - 1])
        return outputRange[outputRange.length - 1]

      for (let i = 0; i < inputRange.length - 1; i++) {
        if (input >= inputRange[i] && input <= inputRange[i + 1]) {
          const t =
            (input - inputRange[i]) / (inputRange[i + 1] - inputRange[i])
          if (
            typeof outputRange[i] === 'string' &&
            outputRange[i].includes('%')
          ) {
            const start = parseFloat(outputRange[i] as string)
            const end = parseFloat(outputRange[i + 1] as string)
            return start + (end - start) * t + '%'
          }
          return (
            (outputRange[i] as number) +
            ((outputRange[i + 1] as number) - (outputRange[i] as number)) * t
          )
        }
      }
      return outputRange[0]
    }

    function getTransformFromOffset(offset: number) {
      const rotateY = lerp(offset, [-200, 0, 200], [20, 0, -20])
      const scale = lerp(offset, [-200, 0, 200], [0.7, 1, 0.7])
      const x = lerp(
        offset,
        [-800, -200, 200, 800],
        ['100%', '0%', '0%', '-100%']
      )
      const zIndex = Math.max(0, Math.round(1000 - Math.abs(offset)))
      return { rotateY, scale, x, zIndex }
    }

    function updateTransforms() {
      allItems.forEach((item, virtualIndex) => {
        const img = item.querySelector('.coverflow-item') as HTMLElement
        if (!img) return

        const offset = getOffset(virtualIndex, currentX)
        const { rotateY, scale, x, zIndex } = getTransformFromOffset(offset)

        ;(item as HTMLElement).style.zIndex = zIndex.toString()

        const xPx = x === '0%' ? 0 : (parseFloat(x as string) / 100) * itemWidth

        img.style.transform = `perspective(500px) translateX(${xPx}px) rotateY(${rotateY}deg) scale(${scale})`
      })
    }

    function getSnapPosition(virtualIndex: number) {
      if (!carouselContainer) return 0
      const containerCenter = carouselContainer.offsetWidth / 2
      const itemStart = virtualIndex * (itemWidth + gap)
      return containerCenter - itemStart - itemWidth / 2
    }

    function checkLoopJump() {
      if (isDragging || animationFrameId) return

      const singleSetWidth = totalItems * (itemWidth + gap)

      if (currentX > -singleSetWidth / 2) {
        currentX -= singleSetWidth
        carouselUl.style.transition = 'none'
        updateCarouselPosition()
        setTimeout(() => {
          carouselUl.style.transition = ''
        }, 0)
      }

      const maxScroll = -singleSetWidth * 1.5
      if (currentX < maxScroll) {
        currentX += singleSetWidth
        carouselUl.style.transition = 'none'
        updateCarouselPosition()
        setTimeout(() => {
          carouselUl.style.transition = ''
        }, 0)
      }
    }

    function findNearestItem() {
      if (!carouselContainer) return totalItems
      const containerCenter = carouselContainer.offsetWidth / 2
      let nearestIndex = totalItems
      let minDistance = Infinity

      allItems.forEach((item, virtualIndex) => {
        const itemStart = virtualIndex * (itemWidth + gap)
        const itemCenterX = itemStart + currentX + itemWidth / 2
        const distance = Math.abs(itemCenterX - containerCenter)
        if (distance < minDistance) {
          minDistance = distance
          nearestIndex = virtualIndex
        }
      })

      return nearestIndex
    }

    function getRealProjectIndex(virtualIndex: number): number {
      if (virtualIndex < cloneCount) {
        return virtualIndex
      } else if (virtualIndex < cloneCount + totalItems) {
        return virtualIndex - cloneCount
      } else {
        return virtualIndex - cloneCount - totalItems
      }
    }

    function updateProjectDescriptionFromCarousel() {
      const nearestVirtualIndex = findNearestItem()
      const realIndex = getRealProjectIndex(nearestVirtualIndex)
      if (realIndex !== lastProjectIndex) {
        lastProjectIndex = realIndex
        updateProjectDescription(realIndex)
      }
    }

    function updateProjectDescriptionForVirtualIndex(virtualIndex: number) {
      const realIndex = getRealProjectIndex(virtualIndex)
      if (realIndex !== lastProjectIndex) {
        lastProjectIndex = realIndex
        updateProjectDescription(realIndex)
      }
    }

    function goToItem(virtualIndex: number) {
      updateProjectDescriptionForVirtualIndex(virtualIndex)
      const snapX = getSnapPosition(virtualIndex)
      animateTo(snapX)
    }

    function nextItem() {
      const currentVirtualIndex = findNearestItem()
      const nextVirtualIndex = currentVirtualIndex + 1
      goToItem(nextVirtualIndex)
    }

    function prevItem() {
      const currentVirtualIndex = findNearestItem()
      const prevVirtualIndex = currentVirtualIndex - 1
      goToItem(prevVirtualIndex)
    }

    function startAutoPlay() {
      if (autoPlayTimer) return
      autoPlayTimer = window.setInterval(() => {
        if (!isDragging && !animationFrameId && isAutoPlaying) {
          nextItem()
        }
      }, autoPlayInterval)
    }

    function stopAutoPlay() {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer)
        autoPlayTimer = null
      }
    }

    function pauseAutoPlay() {
      stopAutoPlay()
      setTimeout(() => {
        if (isAutoPlaying) {
          startAutoPlay()
        }
      }, 5000)
    }

    function animateTo(targetX: number, duration = 450) {
      const startX = currentX
      const startTime = performance.now()

      function animate(currentTime: number) {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)

        const easeOutCubic = 1 - Math.pow(1 - progress, 3)
        currentX = startX + (targetX - startX) * easeOutCubic

        updateCarouselPosition()

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate)
        } else {
          animationFrameId = null
          checkLoopJump()
          updateProjectDescriptionFromCarousel()
        }
      }

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      animationFrameId = requestAnimationFrame(animate)
    }

    function updateCarouselPosition() {
      carouselUl.style.transform = `translateX(${currentX}px)`
      updateTransforms()
      checkLoopJump()
    }

    const handleMouseDown = (e: MouseEvent) => {
      const clickedElement = (e.target as HTMLElement).closest('.ticker-item')
      if (clickedElement) {
        clickedItemIndex = Array.from(allItems).indexOf(clickedElement)
      } else {
        clickedItemIndex = null
      }

      isDragging = true
      startX = e.pageX
      startScrollLeft = currentX
      lastX = e.pageX
      lastTime = performance.now()
      velocity = 0
      dragDistance = 0
      carouselUl.style.cursor = 'grabbing'

      pauseAutoPlay()

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = null
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      e.preventDefault()
      const now = performance.now()
      const deltaTime = now - lastTime
      const deltaX = e.pageX - lastX

      if (deltaTime > 0) {
        velocity = deltaX / deltaTime
      }

      const x = e.pageX - startX
      dragDistance = Math.abs(x)
      currentX = startScrollLeft + x
      updateCarouselPosition()

      lastX = e.pageX
      lastTime = now
    }

    const handleMouseUp = () => {
      if (isDragging) {
        isDragging = false
        carouselUl.style.cursor = 'grab'

        if (dragDistance < 5 && clickedItemIndex !== null) {
          const offset = getOffset(clickedItemIndex, currentX)

          if (offset < -50) {
            prevItem()
          } else if (offset > 50) {
            nextItem()
          } else {
            goToItem(clickedItemIndex)
          }
        } else {
          const nearestIndex = findNearestItem()
          updateProjectDescriptionForVirtualIndex(nearestIndex)
          const snapX = getSnapPosition(nearestIndex)
          animateTo(snapX)
        }

        dragDistance = 0
        clickedItemIndex = null

        pauseAutoPlay()
      }
    }

    const handleMouseLeave = () => {
      if (isDragging) {
        isDragging = false
        carouselUl.style.cursor = 'grab'
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      isDragging = true
      startX = e.touches[0].pageX
      startScrollLeft = currentX
      lastX = e.touches[0].pageX
      lastTime = performance.now()
      velocity = 0

      pauseAutoPlay()

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = null
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return
      const now = performance.now()
      const deltaTime = now - lastTime
      const deltaX = e.touches[0].pageX - lastX

      if (deltaTime > 0) {
        velocity = deltaX / deltaTime
      }

      const x = e.touches[0].pageX - startX
      currentX = startScrollLeft + x
      updateCarouselPosition()

      lastX = e.touches[0].pageX
      lastTime = now
    }

    const handleTouchEnd = () => {
      if (isDragging) {
        isDragging = false

        const nearestIndex = findNearestItem()
        updateProjectDescriptionForVirtualIndex(nearestIndex)
        const snapX = getSnapPosition(nearestIndex)
        animateTo(snapX)

        pauseAutoPlay()
      }
    }

    carouselUl.addEventListener('mousedown', handleMouseDown)
    carouselUl.addEventListener('mousemove', handleMouseMove)
    carouselUl.addEventListener('mouseup', handleMouseUp)
    carouselUl.addEventListener('mouseleave', handleMouseLeave)
    carouselUl.addEventListener('touchstart', handleTouchStart)
    carouselUl.addEventListener('touchmove', handleTouchMove)
    carouselUl.addEventListener('touchend', handleTouchEnd)

    carouselUl.style.cursor = 'grab'

    allImages.forEach((img) => {
      ;(img as HTMLElement).style.cursor = 'pointer'
    })

    if (carouselContainer) {
      const centerVirtualIndex = totalItems
      currentX = getSnapPosition(centerVirtualIndex)
      updateCarouselPosition()
    }

    updateTransforms()
    initializeDescriptionPosition()
    currentProjectIndex = 0
    startAutoPlay()

    return () => {
      carouselUl.removeEventListener('mousedown', handleMouseDown)
      carouselUl.removeEventListener('mousemove', handleMouseMove)
      carouselUl.removeEventListener('mouseup', handleMouseUp)
      carouselUl.removeEventListener('mouseleave', handleMouseLeave)
      carouselUl.removeEventListener('touchstart', handleTouchStart)
      carouselUl.removeEventListener('touchmove', handleTouchMove)
      carouselUl.removeEventListener('touchend', handleTouchEnd)
      stopAutoPlay()
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [])

  return (
    <section className="projects-section">
      <div className="projects-container">
        <h2 className="projects-title">Projects</h2>
        <div className="projects-carousel-wrapper">
          <div className="mask">
            <div
              role="region"
              aria-roledescription="carousel"
              className="coverflow-carousel"
              draggable={false}
              style={{
                display: 'flex',
                position: 'relative',
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                userSelect: 'none',
                touchAction: 'pan-y',
              }}
            >
              <ul
                ref={carouselUlRef}
                role="group"
                id="projects-carousel-ul"
                style={{
                  display: 'flex',
                  position: 'relative',
                  listStyleType: 'none',
                  padding: 0,
                  margin: 0,
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                  gap: 0,
                  alignItems: 'center',
                  width: '100%',
                  height: '100%',
                  maxHeight: '100%',
                  maxWidth: '100%',
                }}
              >
                {projectsConfig.images.map((imageSrc, index) => (
                  <li
                    key={index}
                    className="ticker-item"
                    aria-hidden="false"
                    aria-posinset={index + 1}
                    aria-setsize={projectsConfig.images.length}
                    style={{
                      flexGrow: 0,
                      flexShrink: 0,
                      position: 'relative',
                      height: 'fit-content',
                      zIndex: 1000,
                      transform: 'none',
                    }}
                  >
                    <Image
                      draggable={false}
                      src={imageSrc}
                      alt={`Project ${index + 1}`}
                      width={350}
                      height={350}
                      className="coverflow-item"
                      style={{ transform: 'perspective(500px)' }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="project-description-area" id="project-description-area">
          <div className="project-description-viewport">
            <div
              ref={descriptionTrackRef}
              className="project-description-track"
              id="project-description-track"
            >
              {projectsConfig.projects.map((project, index) => (
                <div
                  key={index}
                  className="project-content-item"
                  data-project-index={index}
                >
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  <div className="project-technologies">
                    {project.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="technology-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="project-links">
                    <a href={project.liveLink} className="project-link">
                      Live <span style={{ fontSize: '1.2rem' }}>→</span>
                    </a>
                    <a href={project.githubLink} className="project-link">
                      GitHub <span style={{ fontSize: '1.2rem' }}>→</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

