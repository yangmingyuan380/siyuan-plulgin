# 导入os模块
import os
import shutil

# 获取当前操作系统的名称
system = os.name

# 根据不同的系统，选择不同的命令行工具
if system == "nt": # Windows系统
  cmd = "cmd"
elif system == "posix": # Linux或MacOS系统
  cmd = "bash"
else: # 其他系统
  print("Unsupported system.")
  exit()
status = os.system(f"{cmd} -c 'pnpm build'")
# 判断状态码是否为0
if status == 0:
  print("打包成功")
  # 思源笔记工作目录
  path = "/mnt/d/jetaime/softdocument/siyuanWokerSpace"
  source = './dist/main.js'
  target1 = path+"/software/data/plugins/mytest"
  target2 = path+"/code/data/plugins/mytest"
  shutil.copyfile(source, target1+"/main.js")
  shutil.copyfile(source, target2+"/main.js")
  shutil.copyfile("./manifest.json", target1+"/manifest.json")
  shutil.copyfile("./manifest.json", target2+"/manifest.json")
else:
  print("Command failed with status code:", status)