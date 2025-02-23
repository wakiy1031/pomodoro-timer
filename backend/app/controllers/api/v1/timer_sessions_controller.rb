module Api
  module V1
    class TimerSessionsController < ApplicationController
      def create
        timer_session = TimerSession.new(timer_session_params)

        if timer_session.save
          render json: timer_session, status: :created
        else
          render json: { errors: timer_session.errors }, status: :unprocessable_entity
        end
      end

      def show
        timer_session = TimerSession.find(params[:id])
        render json: timer_session, status: :ok
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Timer session not found' }, status: :not_found
      end
      private

      def timer_session_params
        params.require(:timer_session).permit(
          :user_id,
          :focus_duration,
          :break_duration
        )
      end
    end
  end
end
