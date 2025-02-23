class CreateTimerSessions < ActiveRecord::Migration[8.0]
  def change
    create_table :timer_sessions do |t|
      t.bigint :user_id, null: true  # ユーザー登録は任意
      t.datetime :started_at, null: false
      t.datetime :ended_at
      t.integer :focus_duration, null: false, default: 1500  # 25分をデフォルトに
      t.integer :break_duration, null: false, default: 300   # 5分をデフォルトに
      t.integer :completed_cycles, null: false, default: 0
      t.integer :status, null: false, default: 0  # 0: initial, 1: in_progress, 2: paused, 3: completed, 4: interrupted

      t.timestamps

      t.index :user_id
      t.index :status
      t.index :started_at
    end
  end
end
