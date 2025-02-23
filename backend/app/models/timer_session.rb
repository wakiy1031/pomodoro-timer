class TimerSession < ApplicationRecord
  # Relations
  belongs_to :user, optional: true

  # Validations
  validates :focus_duration,
            presence: true,
            numericality: {
              only_integer: true,
              greater_than_or_equal_to: 300  # 最小5分
            }

  validates :break_duration,
            presence: true,
            numericality: {
              only_integer: true,
              greater_than_or_equal_to: 60   # 最小1分
            }

  validates :status, presence: true

  # Enums
  enum :status, {
    initial: 0,
    in_progress: 1,
    paused: 2,
    completed: 3,
    interrupted: 4
  }

  # Callbacks
  before_create :set_started_at

  # Instance methods
  def start
    return false unless initial?
    update(status: :in_progress)
  end

  def pause
    return false unless in_progress?
    update(status: :paused)
  end

  def resume
    return false unless paused?
    update(status: :in_progress)
  end

  def complete
    return false if completed? || interrupted?
    update(status: :completed, ended_at: Time.current)
  end

  def remaining_time
    return 0 if completed? || interrupted?
    focus_duration - ((Time.current - started_at).to_i % focus_duration)
  end

  private

  def set_started_at
    self.started_at = Time.current
  end
end
