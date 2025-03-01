class ChangeStatusTypeInTimerSessions < ActiveRecord::Migration[8.0]
  def change
    remove_column :timer_sessions, :status
    add_column :timer_sessions, :status, :integer, default: 0
  end
end
