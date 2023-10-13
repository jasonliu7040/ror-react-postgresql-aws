class ConvertTablesToUtf < ActiveRecord::Migration
  def change
    encoding = 'utf8'
    collation = 'utf8_general_ci'

    connection = ActiveRecord::Base.connection
    tables = connection.tables
    dbname =connection.current_database

    execute <<-SQL
      ALTER DATABASE #{dbname} CHARACTER SET #{encoding} COLLATE #{collation};
    SQL

    tables.each do |tablename|
      execute <<-SQL
        ALTER TABLE #{dbname}.#{tablename} CONVERT TO CHARACTER SET #{encoding} COLLATE #{collation};
      SQL
    end
  end
end
