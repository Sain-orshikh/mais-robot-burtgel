'use client'

import { useEffect, useState } from 'react'
import CardBox from '@/app/components/shared/CardBox'
import { Calendar, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

// Event dates
const EVENT_DATES = {
  registrationOpen: new Date('2026-01-18T10:00:00+08:00'),
  registrationClose: new Date('2026-01-21T18:00:00+08:00'),
  competitionStart: new Date('2026-01-25T08:30:00+08:00'),
}

type EventStage = 'before-registration' | 'registration-open' | 'registration-closed' | 'competition-started'

export const EventCountdownCard = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [stage, setStage] = useState<EventStage>('before-registration')

  useEffect(() => {
    // Update time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Determine current stage
    if (currentTime < EVENT_DATES.registrationOpen) {
      setStage('before-registration')
    } else if (currentTime < EVENT_DATES.registrationClose) {
      setStage('registration-open')
    } else if (currentTime < EVENT_DATES.competitionStart) {
      setStage('registration-closed')
    } else {
      setStage('competition-started')
    }
  }, [currentTime])

  const getTimeRemaining = (targetDate: Date) => {
    const diff = targetDate.getTime() - currentTime.getTime()
    if (diff <= 0) return null

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return { days, hours, minutes, seconds }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('mn-MN', {
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('mn-MN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  const getStageInfo = () => {
    switch (stage) {
      case 'before-registration':
        return {
          icon: '📝',
          title: 'Бүртгэл эхлэх',
          date: formatDate(EVENT_DATES.registrationOpen),
          time: formatTime(EVENT_DATES.registrationOpen),
          countdown: getTimeRemaining(EVENT_DATES.registrationOpen),
          color: 'text-cyan-700 dark:text-info',
          bgColor: 'bg-cyan-100 dark:bg-info/10',
        }
      case 'registration-open':
        return {
          icon: '⛔',
          title: 'Бүртгэл хаагдах',
          date: formatDate(EVENT_DATES.registrationClose),
          time: formatTime(EVENT_DATES.registrationClose),
          countdown: getTimeRemaining(EVENT_DATES.registrationClose),
          color: 'text-orange-700 dark:text-warning',
          bgColor: 'bg-orange-100 dark:bg-warning/10',
        }
      case 'registration-closed':
        return {
          icon: '🏁',
          title: 'Тэмцээн эхлэх',
          date: formatDate(EVENT_DATES.competitionStart),
          time: formatTime(EVENT_DATES.competitionStart),
          countdown: getTimeRemaining(EVENT_DATES.competitionStart),
          color: 'text-green-700 dark:text-success',
          bgColor: 'bg-green-100 dark:bg-success/10',
        }
      case 'competition-started':
        return {
          icon: '🎉',
          title: 'Тэмцээн эхэлсэн',
          date: 'Амжилт хүсье!',
          time: '',
          countdown: null,
          color: 'text-blue-700 dark:text-primary',
          bgColor: 'bg-blue-100 dark:bg-primary/10',
        }
    }
  }

  const stageInfo = getStageInfo()
  const countdown = stageInfo.countdown

  return (
    <CardBox className={`${stageInfo.bgColor} border-none h-full flex flex-col justify-between`}>
      <div className='flex flex-col gap-2'>
        {/* Header - Compact */}
        <div className='flex items-start gap-2'>
          <span className='text-xl'>{stageInfo.icon}</span>
          <div className='flex-1 min-w-0'>
            <h3 className={`text-sm font-semibold ${stageInfo.color} leading-tight`}>
              {stageInfo.title}
            </h3>
            {stageInfo.time && (
              <div className='flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5'>
                <Calendar size={10} />
                <span className='truncate'>{stageInfo.date} · {stageInfo.time}</span>
              </div>
            )}
          </div>
        </div>

        {/* Countdown - Compact */}
        {countdown ? (
          <div className='flex gap-1'>
            {countdown.days > 0 && (
              <div className='flex-1 text-center p-1 bg-background/50 rounded'>
                <div className={`text-lg font-bold ${stageInfo.color} leading-tight`}>{countdown.days}</div>
                <div className='text-[9px] text-muted-foreground'>өдөр</div>
              </div>
            )}
            <div className='flex-1 text-center p-1 bg-background/50 rounded'>
              <div className={`text-lg font-bold ${stageInfo.color} leading-tight`}>{countdown.hours}</div>
              <div className='text-[9px] text-muted-foreground'>цаг</div>
            </div>
            <div className='flex-1 text-center p-1 bg-background/50 rounded'>
              <div className={`text-lg font-bold ${stageInfo.color} leading-tight`}>{countdown.minutes}</div>
              <div className='text-[9px] text-muted-foreground'>мин</div>
            </div>
          </div>
        ) : (
          <div className={`text-center text-sm font-bold ${stageInfo.color}`}>
            {stageInfo.date}
          </div>
        )}
      </div>
    </CardBox>
  )
}
