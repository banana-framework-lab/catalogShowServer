package common

import (
	"fmt"
	"os/exec"
	"strconv"
	"strings"
)

type VideoS struct{}

var Video = VideoS{}

func (VideoS) GetFfmpeg() ([]byte, error) {
	cmdName := "./ffmpeg"
	args := []string{
		"-version",
	}

	cmd := exec.Command(cmdName, args...)

	output, err := cmd.CombinedOutput()
	return output, err
}

func (VideoS) GetShortcut(videoSrc string, time int) ([]byte, error) {
	cmdName := "./ffmpeg"
	args := []string{
		"-ss",
		strconv.Itoa(time),
		"-i",
		videoSrc,
		"-vframes",
		"1",
		"-loglevel",
		"quiet",
		"-f",
		"mjpeg",
		"pipe:1",
	}

	cmd := exec.Command(cmdName, args...)

	output, err := cmd.CombinedOutput()
	return output, err
}

func (VideoS) GetDuration(videoSrc string) (string, error) {
	cmdName := "./ffprobe"
	args := []string{
		"-v",
		"error",
		"-show_entries",
		"format=duration",
		"-of",
		"default=noprint_wrappers=1:nokey=1",
		"-i",
		videoSrc,
	}

	cmd := exec.Command(cmdName, args...)

	output, err := cmd.CombinedOutput()
	return strings.Trim(fmt.Sprintf("%s", output), "\r\n"), err
}
