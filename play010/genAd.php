<?php
//处理参数，并进行参数检查
$index_html = isset($argv[2]) && substr($argv[2],0,1) != '-' ? $argv[2] : "./index.html";
$force_del = isset($argv[2]) && substr($argv[2],0,2) == '-f' ? true :false;
$ad_type = isset($argv[1])?trim($argv[1]):"";
$ad_types = array("adwords","unity","fb","help");
$self_filename = basename(__FILE__);
if(!in_array($ad_type,$ad_types)){
	echo "广告平台不存在，请输入'php ./$self_filename help'展示帮助文档\n"; 
	exit(1);
}
//帮助文档说明
if($ad_type == 'help'){
	echo <<<END
用法：php ./$self_filename 参数一 [参数二]
	参数一为广告平台名，可为以下四者之一：adwords unity fb help
	参数二是可选参数，可以指定html文件，例如another.html,默认为index.html,如果参数以-开头，做其他用途，例如
		-f为在输出目录已存在时，不经确认直接删除
END;
	exit(0);
}

//检查输出文件夹并处理
$output_path = "./$ad_type";
if($ad_type == "adwords"){
	$output_path2 = "./${ad_type}_landscape";
	if(!is_dir($output_path2)){//没有该文件夹
		if(!mkdir($output_path2)){
			die("创建 ${output_path2}失败\n");
		}
	}else{//已经有该文件夹了
		if($force_del){
			del_dir($output_path2);
			if(!mkdir($output_path2)){
				die("创建 ${output_path2}失败\n");
			}
		}else{
			printf("是否确认将输出目录$output_path2 删除? 是:y  否:n\n");
			$confirm = fscanf(STDIN,"%s");
			if(trim($confirm[0]) == "y"){
				//删除已经存在的目录
				del_dir($output_path2);
			}else{
				echo "请将$output_path2 改名，再重新执行\n";
				exit(2);
			}
			if(!mkdir($output_path2)){
				die("创建 ${output_path2}失败\n");
			}
		}
	}
}
if(!is_dir($output_path)){//没有该文件夹
	if(!mkdir($output_path)){
		die("创建 ${output_path}失败\n");
	}
}else{//已经有该文件夹了
	if($force_del){
			del_dir($output_path);
			if(!mkdir($output_path)){
				die("创建 ${output_path}失败\n");
			}
	}else{
		printf("是否确认将输出目录$output_path 删除? 是:y  否:n\n");
		$confirm = fscanf(STDIN,"%s");
		if(trim($confirm[0]) == "y"){
			//删除已经存在的目录
			del_dir($output_path);
		}else{
			echo "请将$output_path 改名，再重新执行\n";
			exit(2);
		}
		if(!mkdir($output_path)){
			die("创建 ${output_path}失败\n");
		}
	}
}

//打开html文件
$index_fp= fopen($index_html,"rb");
if(!$index_fp){
	echo "index.html打开失败\n";
	exit(1);
}
$tmp_fp = tmpfile();//存放将css/js引入html后的代码
if($ad_type == "adwords"){//为adwords准备横版竖版两份代码
	$tmp_fp2 = tmpfile();
}
$in_comment = false;

while(($line = fgets($index_fp)) != false){//遍历每一行html代码，对匹配的代码进行处理
	//过滤注释掉的代码
	if($in_comment ){//在注释里
		if(preg_match('/-->/',$line)){
			$new_line = "";
			$end = strpos($line,"-->");
			if($end < strlen($line)-3){
				$new_line .= substr($line,$end+3);
			}
			fwrite($tmp_fp,$new_line);	
			if($ad_type == "adwords"){
				fwrite($tmp_fp2,$new_line);
			}
			$in_comment = false;
		}
		continue;
	}else{//不在注释里
		if(preg_match('/^\s*?<!--(.*?)-->/',$line)){
			$new_line = "";
			$end = strpos($line,"-->");
			if($end < strlen($line)-3){
				$new_line .= substr($line,$end+3);
			}
			fwrite($tmp_fp,$new_line);
			if($ad_type == "adwords"){
				fwrite($tmp_fp2,$new_line);
			}
			continue;
		}else if(preg_match('/^\s*?<!--.*?(?!-->)/',$line)){
			$in_comment = true;
			continue;
		}
	}
	//匹配script
	if(preg_match('/<script\s+src="([^"]+)"/',$line,$matches)){
		$js_file = $matches[1];
		$js_src = "\n<script>\n";
		$js_src .= file_get_contents($js_file);
		$js_src .= "\n</script>\n";
		fwrite($tmp_fp,$js_src);
		if($ad_type == "adwords"){
			fwrite($tmp_fp2,$js_src);
		}
		continue;	
	}
	//匹配link
	if(preg_match('/<link(.*?)href="([^"]+)"/',$line,$matches)){
		$media_str = $matches[1];
		//如果生成fb代码时，没有找到竖版css，则跳过该行引入代码
		if($ad_type == "fb" && strpos($media_str,"landscape") >0){
			continue;
		}
		$css_file = $matches[2];
		$css_src = "\n<style>\n";
		//在将css引入html之前，需要先将css中的图片路径修正
		$css_code_arr = file($css_file,FILE_SKIP_EMPTY_LINES);
		if(!$css_code_arr){
			echo "$css_file 打开失败\n";
			exit(3);
		}
		$has_media = false;
		foreach($css_code_arr as $key =>$css_line){
			$css_line = preg_replace("/(?: |\t)+/"," ",$css_line);
			if(preg_match('#^(.*)("|\')([^\2]+(\.png|\.jpg|\.gif))\2(.*$)#',$css_line,$css_matches)){//匹配图片
				$image_file = $css_matches[3];
				if(substr($image_file,0,3) == "../"){//将所有去上级目录取图片的路径改为从当前目录取图片
					$image_file = substr($image_file,1);
				}
				$css_code_arr[$key] = $css_matches[1].$css_matches[2].$image_file.$css_matches[2].$css_matches[5];
			}else if($ad_type == "fb"){
			      if(strpos($css_line,"@media")!== false){
				      $has_media = true;
				      unset($css_code_arr[$key]);
			      }
			      if($has_media){
				      $last_line_num = count($css_code_arr)-1;
				      while(strpos($css_code_arr[$last_line_num],"}") === false){
					      $last_line_num --;
				      }
				      unset($css_code_arr[$last_line_num]);
				      $has_media = false;
			      }
			}
		}
		$css_src .= join("",$css_code_arr);	
		$css_src .="\n</style>\n";
		if($ad_type == "adwords"){
			if(strpos($media_str,"portrait") == false && strpos($media_str,"landscape") == false){
				fwrite($tmp_fp,$css_src);
				fwrite($tmp_fp2,$css_src);
			}else if(strpos($media_str,"portrait") > 0 && strpos($media_str,"landscape") == false){
				fwrite($tmp_fp,$css_src);
			}else if(strpos($media_str,"landscape") > 0 && strpos($media_str,"portrait") == false){
				fwrite($tmp_fp2,$css_src);
			}else{
				echo "error:$media_str,occur landscape and portrait at the same line\n";
				exit(5);
			}
			continue;
		}
		fwrite($tmp_fp,$css_src);
		continue;
	}
	//都不匹配，放入输出文件里
	fwrite($tmp_fp,$line);
	if($ad_type == "adwords"){
		fwrite($tmp_fp2,$line);
	}
}
fseek($tmp_fp,0);//指向临时文件开头

if($ad_type == "adwords"){
	fseek($tmp_fp2,0);//指向临时文件开头
}
$out_fp= fopen("$output_path/index.html","wb");
$in_comment = false;//html注释
$js_in_comment = false;//js注释
$fb_flag1 = false;
$fb_flag2 = false;
while(($line = fgets($tmp_fp)) !=false){
	if(preg_match("#function\s+orient\(\s*\)#",$line)){
		$fb_flag1 = true;
	}else if($fb_flag1 == true && preg_match("#body['\"]\)\.attr\(('|\")class\\1,\s*('|\")portrait\\2\)#",$line)){
		$fb_flag1 = false;
		continue;
	}else if($fb_flag2 == false && preg_match("#orientation\s*=\s*('|\")portrait\\1#",$line)){
		$fb_flag2 = true;
		continue;
	}else if($fb_flag2 == true && preg_match("#\s*}\s*#",$line)){
		$fb_flag2 = false;
		continue;
	}else if($fb_flag1 || $fb_flag2){
		continue;	
	}
	if($in_comment ){//在注释里
		if(preg_match('/-->/',$line)){
			$new_line = "";
			$end = strpos($line,"-->");
			if($end < strlen($line)-3){
				$new_line .= substr($line,$end+3);
			}
			fwrite($out_fp,$new_line);	
			$in_comment = false;
		}
		continue;
	}else{//不在注释里
		if(preg_match('/<!--(.*?)-->/',$line)){
			$start = strpos($line,"<!--")-1;
			$new_line = "";
			if($start > 0){
				$new_line .= substr($line,0,$start -1);
			}
			$end = strpos($line,"-->");
			if($end < strlen($line)-3){
				$new_line .= substr($line,$end+3);
			}
			fwrite($out_fp,$new_line);
			continue;
		}else if(preg_match('/<!--.*?(?!-->)/',$line)){
			$start = strpos($line,"<!--")-1;
			$new_line = "";
			if($start > 0){
				$new_line .= substr($line,0,$start -1);
			}
			fwrite($out_fp,$new_line);
			$in_comment = true;
			continue;
		}
	}
	if($js_in_comment ){//在注释里
		if(preg_match('/\*\/\s*$/',$line)){
			$js_in_comment = false;
		}
		continue;
	}else{//不在注释里
		if(preg_match('/^\s*\/\*.*\*\/\s*$/',$line)){
			continue;
		}else if(preg_match('#^\s*\/\*#',$line)){
			$js_in_comment = true;
			continue;
		}
	}
	if(preg_match('#^\s*//#',$line)){//将单行注释去掉
		continue;
	}
	if(preg_match('#^(.*)("|\')([^\2]+(\.mp3|\.png|\.jpg|\.gif))(\?[^\2]*?)?\2(.*$)#',$line,$matches)){//匹配图片
		$image_file = $matches[3];
		$extension = substr($matches[4],1);
		if($ad_type == "adwords"){
			if($extension == "mp3"){
				continue;
			}
			$file_name = pathinfo($image_file,PATHINFO_BASENAME);
			$dest_file = "$output_path/$file_name";
			if(!copy($image_file,$dest_file)){
				echo "copy $image_file to $dest_file faile\n";
				exit(4);	
			}		
		}else if($ad_type == "unity" || $ad_type == "fb"){
			if($extension == "jpg"){
				$type = "image/jpeg";
			}else if($extension == "mp3"){
				$type = "audio/mp3";
			}else{
				$type = "image/$extension";
			}
			if(!file_exists($image_file)){
				echo "$image_file 不存在或者打不开!";
				exit(3);
			}
			$raw_img = file_get_contents($image_file);
			$b64_img= base64_encode($raw_img);
			$url_data = "data:${type};base64,".$b64_img;		
			if(count($matches) == 7 && !empty($matches[5])){
				if(strpos($line,"`") !== false){
					$url_data = "data:${type};`+new Date().getTime()+`;base64,".$b64_img;
				}else{
					$url_data = "data:${type};+new Date().getTime()+;base64,".$b64_img;
				}
				$new_line = $matches[1].$matches[2].$url_data.$matches[2].$matches[6];
			}else{
				$new_line = $matches[1].$matches[2].$url_data.$matches[2].$matches[6];
			}
			fwrite($out_fp,$new_line);
			continue;
		}
	}
	if($ad_type == "unity" ){		
		if(preg_match("#<head>#",$line)){
			$line .= "<script src=\"mraid.js\"></script>\n";
		}else if(preg_match("#.+?\"\.down\".+?attr.+?href#",$line)){
			$line = "mraid.open(url);\n";
		}else if(preg_match("#^\s*function\s+orient#",$line)){
			$line = "if (mraid.getState() === \"loading\") {\n
        mraid.addEventListener(\"ready\", function(){});\n
    }\n".$line;
		}
	}else if($ad_type == "fb"){
		//\$\(\"\.down\"\)\.attr\(\"href
		if(preg_match("#.+?\"\.down\".+?attr.+?href#",$line)){
			$line = "FbPlayableAd.onCTAClick();\n";
		}

	}else if($ad_type == "adwords"){
		if(preg_match('#(^.+?)(?:\.{1,2}\/)?image\/(.+?(?:\.png|\.jpg|\.gif).*)#',$line,$matches)){//匹配图片
			$new_line = $matches[1].$matches[2];
			fwrite($out_fp,$new_line);
			continue;
		}else if(preg_match('#<head>#',$line)){
			$line = $line."\n".'<meta name="ad.size" content="width=320,height=480">'."\n";
			fwrite($out_fp,$line);
			continue;
		}else if(preg_match('#id="music"#',$line)){
			continue;
		}
	}
	//都不匹配，放入输出文件里
	fwrite($out_fp,$line);
}
fclose($index_fp);
fclose($out_fp);
fclose($tmp_fp);

if($ad_type == "adwords"){

	$out_fp2= fopen("$output_path2/index_landscape.html","wb");
	$in_comment = false;//html注释
	$js_in_comment = false;//js注释
	
	while(($line = fgets($tmp_fp2)) !=false){
		if($in_comment ){//在注释里
			if(preg_match('/-->/',$line)){
				$new_line = "";
				$end = strpos($line,"-->");
				if($end < strlen($line)-3){
					$new_line .= substr($line,$end+3);
				}
				fwrite($out_fp2,$new_line);	
				$in_comment = false;
			}
			continue;
		}else{//不在注释里
			if(preg_match('/^\s*?<!--(.*?)-->/',$line)){
				$new_line = "";
				$end = strpos($line,"-->");
				if($end < strlen($line)-3){
					$new_line .= substr($line,$end+3);
				}
				fwrite($out_fp2,$new_line);
				continue;
			}else if(preg_match('/^\s*?<!--.*?(?!-->)/',$line)){
				$in_comment = true;
				continue;
			}
		}
		if($js_in_comment ){//在注释里
			if(preg_match('/\*\/\s*?$/',$line)){
				$js_in_comment = false;
			}
			continue;
		}else{//不在注释里
			if(preg_match('#^\s*?/\*.*\*/\s*?$#',$line)){
				continue;
			}else if(preg_match('#^\s*?\/\*#',$line)){
				$js_in_comment = true;
				continue;
			}
		}
		if(preg_match('#^\s*//#',$line)){//将单行注释去掉
			continue;
		}
		if(preg_match('#^(.*)("|\')([^\2]+(\.png|\.jpg|\.gif))\2(.*$)#',$line,$matches)){//匹配图片
			$image_file = $matches[3];
			$file_name = pathinfo($image_file,PATHINFO_BASENAME);
			$dest_file = "$output_path2/$file_name";
			if(!copy($image_file,$dest_file)){
				echo "copy $image_file to $dest_file faile\n";
				exit(4);	
			}		
		}
		if(preg_match('#(^.+?)(?:\.{1,2}\/)?image\/(.+?(?:\.png|\.jpg|\.gif).*)#',$line,$matches)){//匹配图片
			$new_line = $matches[1].$matches[2];
			fwrite($out_fp2,$new_line);
			continue;
		}else if(preg_match('#<head>#',$line)){
			$line = $line."\n".'<meta name="ad.size" content="width=320,height=480">'."\n";
			fwrite($out_fp2,$line);
			continue;
		}else if(preg_match('#id="music"#',$line)){
			continue;
		}
	
		//都不匹配，放入输出文件里
		fwrite($out_fp2,$line);
	}
	fclose($out_fp2);
	fclose($tmp_fp2);
	$zip = new ZipArchive;
	chdir($output_path);
	$dir_dp = opendir(".");
	$file_list = array();
	while(($file = readdir($dir_dp)) != false){
		if($file != "." && $file != ".."){
			$file_list[] = "./$file";	
		}
	}
	closedir($dir_dp);
	if (($ret_code = $zip->open("./index_portrait.zip",ZIPARCHIVE::CREATE)) === TRUE) {
		foreach($file_list as $file){
			$zip->addFile($file);
		}
		$zip->close();
	} else {
		zip_show_error($ret_code);
	}
	chdir("../$output_path2");
	$dir_dp = opendir(".");
	$file_list = array();
	while(($file = readdir($dir_dp)) != false){
		if($file != "." && $file != ".."){
			$file_list[] = "./$file";	
		}
	}
	closedir($dir_dp);
	if (($ret_code = $zip->open("./index_landscape.zip",ZIPARCHIVE::CREATE)) === TRUE) {
		foreach($file_list as $file){
			$zip->addFile($file);
		}
		$zip->close();
	} else {
		zip_show_error($ret_code);
	}
}

//删除目录
function del_dir($dir){
	if(!is_dir($dir)){
		die("$dir 不存在或者不是目录");
	}
	$dir = rtrim($dir,"/");
	$dp = opendir($dir);
	if(!$dp){
		die("$dir 打不开\n");
	}
	while($file = readdir($dp)){
		if($file != "." && $file != ".."){
			if(is_file($dir."/".$file)){
				unlink($dir."/".$file);
			}else if(is_dir($dir."/".$file)){
				del_dir($dir."/".$file);
			}else{
				die("存在特殊文件，请查看${dir}/$file");
			}
		}
	}
	closedir($dp);
	rmdir($dir);
}

function zip_show_error($ret_code){

		switch($ret_code){
		case ZipArchive::ER_EXISTS:
			echo 'File already exists.';
			break;
		case ZipArchive::ER_INCONS:
			echo 'Zip archive inconsistent.';
			break;
		case ZipArchive::ER_INVAL:
			echo 'Invalid argument.';
			break;
		case ZipArchive::ER_MEMORY:
			echo 'Malloc failure.';
			break;
		case ZipArchive::ER_NOENT:
			echo 'No such file.';
			break;
		case ZipArchive::ER_NOZIP:
			echo 'Not a zip archive.';
			break;
		case ZipArchive::ER_OPEN:
			echo 'Can\'t open file.';
			break;
		case ZipArchive::ER_READ:
			echo 'Read error.';
			break;
		case ZipArchive::ER_SEEK:
			echo 'Seek error.';
		}
		exit(5);
}
