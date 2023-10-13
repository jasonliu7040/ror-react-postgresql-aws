#
# Makes older rails versions (3.x) work with MySql 5.7
#
# Remove after migrated to V 4.1+
#
class ActiveRecord::ConnectionAdapters::AbstractMysqlAdapter
  # uncomment if you are running a migration
  # NATIVE_DATABASE_TYPES[:primary_key] = "int(11) auto_increment PRIMARY KEY"
end