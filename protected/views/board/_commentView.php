<div class="commentBox">
  <div class="searchHeader">
    <div class="rect"></div>
    <div class="headerInfo"><?= $data->ersteller->nutzername ?> wrote at <?= Yii::app()->dateFormatter->format('MMM dd, yyyy', $data->erstellt_am) ?></div>
  </div>
	<pre><? echo $data->titel ?></pre>
</div>