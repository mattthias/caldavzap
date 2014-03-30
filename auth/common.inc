<?php
	function array_to_xml($array,$level=0)
	{
		static $result="<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n";

		foreach($array as $k => $v)
		{
			if(is_numeric($k))
				array_to_xml($v, $level);
			else
			{
				for($j=0; $j<$level; $j++)
					$result.="	";

				$result.="<".htmlspecialchars($k);
				if($k=='resources')
					$result.=" xmlns=\"urn:com.inf-it:configuration\"";
				if($v=='')
					$result.=" />\n";
				else
				{
					$result.=">";

					if(is_array($v))
					{
						$result.="\n";
						array_to_xml($v, $level+1);
						for($j=0; $j<$level; $j++)
							$result.="	";
					}
					else
						$result.=htmlspecialchars($v);

					$result.="</".htmlspecialchars($k).">\n";
				}
			}
		}
		return $result;
	}
?>