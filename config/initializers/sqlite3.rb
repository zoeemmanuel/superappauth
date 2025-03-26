ActiveRecord::Base.connection.class.prepend(Module.new do
  def raw_connection
    @raw_connection ||= super.tap do |conn|
      conn.busy_timeout = 3000
    end
  end
end)
